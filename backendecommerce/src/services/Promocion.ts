import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Promocion } from "../models/Promocion";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import PromocionRepository from "src/repositories/Promocion";
import ProductoRepository from "src/repositories/Producto";

class PromocionService extends TransactionBaseService {
    protected promocionRepository_: typeof PromocionRepository;
    protected productoRepository_: typeof ProductoRepository;

    constructor(container) {
        super(container);
        this.promocionRepository_ = container.promocionRepository;
        this.productoRepository_ = container.productoRepository;
    }

    getMessage() {
        return "Hello from PromocionService";
    }

    async listar(): Promise<Promocion[]> {
        const promocionRepo = this.activeManager_.withRepository(this.promocionRepository_);
        return promocionRepo.find();
    }

    async listarYContar(
        selector: Selector<Promocion> = {},
        config: FindConfig<Promocion> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Promocion[], number]> {
        const promocionRepo = this.activeManager_.withRepository(this.promocionRepository_);
        const query = buildQuery(selector, config);

        return promocionRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Promocion>,
        config: FindConfig<Promocion> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Promocion[]> {

        if (selector) {
            console.log('Selector is not empty:', selector);
        } else {
            console.log('Selector is empty');
        }
    
        if (config) {
            console.log('Config is not empty:', config);
        } else {
            console.log('Config is empty');
        }

        const [promociones] = await this.listarYContar(selector, config);
        console.log('Promociones:', promociones);
        return promociones;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Promocion>
    ): Promise<Promocion> {
        const promocionRepo = this.activeManager_.withRepository(this.promocionRepository_);
        const query = buildQuery({ id }, config);
        const promocion = await promocionRepo.findOne(query);

        if (!promocion) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Promocion no encontrada");
        }

        return promocion;
    }

    async crear(promocion: Promocion): Promise<Promocion> {
        return this.atomicPhase_(async (manager) => {
            const promocionRepo = manager.withRepository(this.promocionRepository_);
            const promocionCreada = promocionRepo.create(promocion);
            const result = await promocionRepo.save(promocionCreada);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Promocion>, "id">
    ): Promise<Promocion> {
        return await this.atomicPhase_(async (manager) => {
            const promocionRepo = manager.withRepository(this.promocionRepository_);
            const promocion = await this.recuperar(id);
            Object.assign(promocion, data);
            return await promocionRepo.save(promocion);
        });
    }

    async eliminar(id: string): Promise<Promocion> {
        return await this.atomicPhase_(async (manager) => {
            const promocionRepo = manager.withRepository(this.promocionRepository_);
            const promocion = await this.recuperar(id);
            promocion.estaActivo = false;
            promocion.desactivadoEn = new Date();
            return await promocionRepo.save(promocion);
        });
    }

    async recuperarValidas(): Promise<Promocion[]> {
        const promocionRepo = this.activeManager_.withRepository(this.promocionRepository_);
        const promociones = await promocionRepo.find({ where: { esValido: true } });
    
        await Promise.all(promociones.map(async promocion => {
            const productos = await this.productoRepository_.listarPorPromocion(promocion.id);
            const productoConImagen = productos.find(producto => producto.urlImagen !== null);
            promocion.urlImagen = productoConImagen ? productoConImagen.urlImagen : null;
    
            if (productos.length > 0) {
                const nombresProductos = productos.map(producto => producto.nombre);
                const textoInfo = nombresProductos.length > 1 
                    ? `${nombresProductos.slice(0, -1).join(', ')} y ${nombresProductos[nombresProductos.length - 1]}` 
                    : nombresProductos[0];
                promocion.textoInfo = `Promoción válida para los siguientes productos: ${textoInfo}.`;
            } else {
                promocion.textoInfo = "No hay detalles de la promoción en estos momentos, por favor, intente nuevamente más tarde.";
            }
        }));
    
        return promociones;
    }
}

export default PromocionService;