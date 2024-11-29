import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Producto } from "../models/Producto";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import ProductoRepository from "src/repositories/Producto";
import PuntosProductoRepository from "src/repositories/PuntosProducto";
import { PuntosProducto } from "@models/PuntosProducto";

class ProductoService extends TransactionBaseService {
    protected productoRepository_: typeof ProductoRepository;
    protected puntosProductoRepository_: typeof PuntosProductoRepository;

    constructor(container){
        super(container);
        this.productoRepository_ = container.productoRepository;
        this.puntosProductoRepository_ = container.puntosproductoRepository;
    }


    getMessage() {
        return "Hello from ProductoService";
      }

      async listar(): Promise<Producto[]> {
        const productoRepo = this.activeManager_.withRepository(this.productoRepository_);
        return productoRepo.find();
      }
    
      async listarYContar(
        selector: Selector<Producto> ={},
        config: FindConfig<Producto> = {
          skip: 0,
          take: 20,
          relations: [],
        },
        soloEcommerce?: boolean
      ): Promise<[Producto[], number]> {
        console.log("Listar y contar llegó con soloEcommerce: ", soloEcommerce);
        const productoRepo = this.activeManager_.withRepository(this.productoRepository_);
        const query = productoRepo.createQueryBuilder("producto");
        query.where(selector);
        if (config.relations) {
          config.relations.forEach((relation) => {
            query.leftJoinAndSelect(`producto.${relation}`, relation);
          });
        }
        if (config.order) {
          Object.keys(config.order).forEach((key) => {
            query.addOrderBy(`producto.${key}`, config.order[key]);
          });
        }      
        if (config.skip) {
          query.skip(config.skip);
        }
        if (config.take) {
          query.take(config.take);
        }
        if (soloEcommerce) {
          // console.log("Solo ecommerce");
          query.andWhere("producto.sevendeecommerce = true");
        }
        const productos = await query.getManyAndCount();
        return productos;
      }
    
      async listarConPaginacion(
        selector?: Selector<Producto>,
        config: FindConfig<Producto> = {
          skip: 0,
          take: 20,
          relations: [],
        },
        soloEcommerce?: boolean
      ): Promise<Producto[]> {
        // console.log("Listar con paginación llegó con soloEcommerce: ", soloEcommerce);
        const [productos] = await this.listarYContar(selector, config, soloEcommerce);
        //filter productos that have estaActivo, filter all
        productos.filter(producto => producto.estaActivo === true);
        return productos;
      }
    
      async recuperar(
        attribute: Partial<Producto>,
        config?: FindConfig<Producto>
      ): Promise<Producto> {
        const productoRepo = this.activeManager_.withRepository(this.productoRepository_);
        const query = buildQuery(attribute, config);
        const producto = await productoRepo.findOne(query);
    
        if (!producto) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Producto no encontrado");
        }
        return producto;
      }

      async recuperarConDetalle(id: string, options: FindConfig<Producto> = {}): Promise<Producto> {
        const productoRepo = this.activeManager_.withRepository(this.productoRepository_);
        const relations = ["inventarios", ...(options.relations || [])];
        const query = buildQuery({ id }, { relations });
        const producto = await productoRepo.findOne(query);
    
        if (!producto) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }
    
        return producto;
      }

      async recuperarProductosConDetalle(options: FindConfig<Producto> = {}): Promise<Producto[]> {
        const productoRepo = this.activeManager_.withRepository(this.productoRepository_);
        const relations = ["inventarios", ...(options.relations || [])];
        const query = buildQuery({}, { relations });
        const productos = await productoRepo.find(query);
    
        if (!productos || productos.length === 0) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "No se encontraron productos");
        }
    
        return productos;
      }

      async recuperarProductosPorCiudad(ciudadId :string, options: FindConfig<Producto> = {}): Promise<Producto[]> {
        //use productoRepo.findProductosWithInventariosByCiudad(ciudadId)
        const productoRepo = this.activeManager_.withRepository(this.productoRepository_);
        const productos = await productoRepo.findProductosWithInventariosByCiudad(ciudadId);
        const puntosProductoRepo = this.activeManager_.withRepository(this.puntosProductoRepository_);
        if (!productos || productos.length === 0) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "No se encontraron productos");
        }
        //revisar que la promocion de cada producto este activa
        await Promise.all(productos.map(async producto => {
          if (producto.promocion && (producto.promocion.estaActivo === false || producto.promocion.esValido === false)) {
            producto.promocion = null;
          }
          // Revisa si el producto tiene puntos
          const puntosProducto: PuntosProducto = await puntosProductoRepo.encontrarPuntosPorProductoActivo(producto.id);
          if (puntosProducto) {
            producto.cantidadPuntos = puntosProducto.cantidadPuntos;
          }
        }));

        //ordenar productos alfabeticamente y los que no tengan inventario al final
        productos.sort((a, b) => {
          const stockA = a.inventarios.reduce((acc, inv) => acc + inv.stock, 0);
          const stockB = b.inventarios.reduce((acc, inv) => acc + inv.stock, 0);
    
          if (stockA === 0 && stockB > 0) {
              return 1;
          }
          if (stockA > 0 && stockB === 0) {
              return -1;
          }
          if (stockA !== stockB) {
              return stockB - stockA;
          }
          return a.nombre.localeCompare(b.nombre);
        });

        //verifica que el stock sea mayor a 0, si no lo es, lo elimina del array
        return productos.filter(producto => producto.inventarios.reduce((acc, inv) => acc + inv.stock, 0) > 0);
      }
      
    
      async crear(producto: Producto): Promise<Producto> {
        return this.atomicPhase_(async (manager) => {
          const productoRepo = manager.withRepository(this.productoRepository_);

          const existingProducto = await productoRepo.createQueryBuilder("producto")
          .where("LOWER(producto.nombre) = LOWER(:nombre)", { nombre: producto.nombre })
          .getOne();
          if (existingProducto) {
            throw new Error(`Producto com nombre "${producto.nombre}" ya existe.`);
          }
          // Integración con CRM en https://heladeria2.od2.vtiger.com/restapi/vtap/api/addProduct
          let idCRM = null;
          try {
            const username = 'dep2.crm@gmail.com';
            const password = '97FO4nsSpV6UneKW';
            const credentials = Buffer.from(`${username}:${password}`).toString('base64');

            const bodyData ={
              "Nomproducto": producto.nombre,
              "Preciounit": producto.precioEcommerce,
              "Descripcion": producto.descripcion,
            }
      
            const response = await fetch('https://heladeria2.od2.vtiger.com/restapi/vtap/api/addProduct', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`,
              },
              body: JSON.stringify(bodyData),
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();
            console.log("Producto creado en CRM: ", data);
            idCRM = data.result.id;
            producto.idCRM = idCRM;
          } catch (error) {
            console.error("Error creando producto en CRM: ", error);
          }
          const productoCreado = productoRepo.create(producto);
          const result = await productoRepo.save(productoCreado);
          return result;
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<Producto>, "id">
      ): Promise<Producto> {
        return await this.atomicPhase_(async (manager) => {
          const productoRepo = manager.withRepository(this.productoRepository_);
          const producto = await this.recuperar({ id });
          Object.assign(producto, data);
          return await productoRepo.save(producto);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const productoRepo = manager.withRepository(this.productoRepository_);
          const producto = await this.recuperar({ id });
          await productoRepo.update({ id }, { estaActivo: false , desactivadoEn: new Date() });
        });
      }

      
}

export default ProductoService;