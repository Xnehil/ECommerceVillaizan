import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Pedido } from "../models/Pedido";
import { Not, Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import pedidoRepository from "src/repositories/Pedido";
import { ubicacionesDelivery, estadoPedidos, enviarMensajeRepartidor, enviarMensajeAdmins } from "../loaders/websocketLoader";
import MotorizadoRepository from "@repositories/Motorizado";
import puntosProductoRepository from "@repositories/PuntosProducto";
import { Motorizado } from "@models/Motorizado";
import InventarioMotorizadoRepository from "@repositories/InventarioMotorizado";
import { InventarioMotorizado } from "@models/InventarioMotorizado";
import { Notificacion } from "../models/Notificacion";
import NotificacionService from "./Notificacion";
import { Delete } from "@nestjs/common";


class PedidoService extends TransactionBaseService {
    protected pedidoRepository_: typeof pedidoRepository;
    protected motorizadoRepository_: typeof MotorizadoRepository;
    protected inventarioMotorizadoRepository_: typeof InventarioMotorizadoRepository;
    protected puntoProductoRepository_: typeof puntosProductoRepository;
    protected notificacionService_: NotificacionService

    constructor(container) {
        super(container);
        this.pedidoRepository_ = container.pedidoRepository;
        this.motorizadoRepository_ = container.motorizadoRepository;
        this.inventarioMotorizadoRepository_ = container.inventariomotorizadoRepository;
        this.puntoProductoRepository_ = container.puntosproductoRepository;
        this.notificacionService_ = container.notificacionService;
    }

    getMessage() {
        return "Hello from PedidoService";
    }

    async listar(): Promise<Pedido[]> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        return pedidoRepo.find();
    }

    async listarYContar(
        selector: Selector<Pedido> = {},
        config: FindConfig<Pedido> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Pedido[], number]> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const query = buildQuery(selector, config);
        return pedidoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Pedido>,
        config: FindConfig<Pedido> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Pedido[]> {
        // Create a new selector if one isn't provided
        const finalSelector: any = selector || {};

        if (finalSelector.estado === '!= carrito') {
            finalSelector.estado = Not('carrito');
        }

        const [pedidos] = await this.listarYContar(finalSelector, config);
        return pedidos;
    }


    async recuperar(
        id: string,
        config?: FindConfig<Pedido>
    ): Promise<Pedido> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const query = buildQuery({ id }, config);
        //const pedido = await pedidoRepo.findOne(query);
        const pedido = await pedidoRepo.encontrarPorId(id);
        //for each detalle in pedido.detalles, add puntosProducto if there is
        if(pedido.detalles){
            for (let detalle of pedido.detalles){
                const puntosProducto = await this.puntoProductoRepository_.encontrarPuntosPorProductoActivo(detalle.producto.id);
                if(puntosProducto){
                    detalle.producto.cantidadPuntos = puntosProducto.cantidadPuntos;
                }
            }
        }
        //console.log("Pedido recuperado: ", pedido);
        //console.log("Pedido recuperado NEW 2: ", pedido);
        if (!pedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedido;
    }

    async recuperarConDetalle(id: string, options: FindConfig<Pedido> = {}): Promise<Pedido> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const relations = ["detalles", "detalles.producto", ...(options.relations || [])];
      
        const queryBuilder = pedidoRepo.createQueryBuilder("pedido")
          .leftJoinAndSelect("pedido.detalles", "detalle", "detalle.estaActivo = :estaActivo", { estaActivo: true })
          .leftJoinAndSelect("detalle.producto", "producto")
          .where("pedido.id = :id", { id });
      
        // Add additional relations if specified in options
        if (options.relations) {
            const joinedRelations = new Set();
            for (const relation of options.relations) {
              if (relation.includes(".")) {
                const [parent, child] = relation.split(".");
                const joinAlias = `${parent}_${child}`;
                if (!joinedRelations.has(joinAlias)) {
                  queryBuilder.leftJoinAndSelect(`${parent}.${child}`, joinAlias);
                  joinedRelations.add(joinAlias);
                }
              } else {
                if (!joinedRelations.has(relation)) {
                  queryBuilder.leftJoinAndSelect(`pedido.${relation}`, relation);
                  joinedRelations.add(relation);
                }
              }
            }
          }
      
        const pedido = await queryBuilder.getOne();
      
        if (!pedido) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }
      
        return pedido;
    }
    
    async crear(pedido: Pedido): Promise<Pedido> {
        return this.atomicPhase_(async (manager) => {
            const pedidoRepo = manager.withRepository(this.pedidoRepository_);
            const pedidoCreado = pedidoRepo.create(pedido);
            const result = await pedidoRepo.save(pedidoCreado);
            return result;
        });
    }

    async checkPedido(pedido: Pedido, motorizado: Motorizado): Promise<boolean> {
        const invetarioMotorizadoRepo = this.activeManager_.withRepository(this.inventarioMotorizadoRepository_);
        try {
            const inventarios: InventarioMotorizado[] = await invetarioMotorizadoRepo.findByMotorizadoId(motorizado.id);
            
            if(!pedido.direccion || !pedido.direccion.ciudad) {
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no tiene dirección o ciudad");
            }
            if(!pedido.direccion.ciudad.id) {
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no tiene ciudad");
            }
            const ciudadId = pedido.direccion.ciudad.id
            // Verificacion de ciudad
            if(ciudadId !== motorizado.ciudad.id) {
                return false;
            }
            // Se itera cada detalle del pedido y se verifica si el motorizado tiene el producto
            for (const detalle of pedido.detalles) {
                const inventario = inventarios.find((inv) => inv.producto.id === detalle.producto.id);
                if (!inventario || inventario.stock < detalle.cantidad) {
                    return false;
                }
            }
        } catch (error) {
            console.error("Error al verificar stock", error);
            return false;
        }
        return true;
    }

    async reduceStock(pedido: Pedido, motorizado: Motorizado): Promise<void> {
        const invetarioMotorizadoRepo = this.activeManager_.withRepository(this.inventarioMotorizadoRepository_);        
        const inventarios: InventarioMotorizado[] = await invetarioMotorizadoRepo.findByMotorizadoId(motorizado.id);
        
        // Iterate each pedido detail and reduce the stock
        for (const detalle of pedido.detalles) {
            try{
                const inventario = inventarios.find((inv) => inv.producto.id === detalle.producto.id);
                if (inventario) {
                    inventario.stock -= detalle.cantidad;
                    await invetarioMotorizadoRepo.save(inventario);
                    if(inventario.stock < inventario.producto.stockSeguridad*2){
                        let nuevaNoti = new Notificacion();
                        nuevaNoti.asunto = "Stock bajo";
                        nuevaNoti.descripcion = "El producto " + inventario.producto.nombre + " tiene un stock menor a " + inventario.producto.stockSeguridad*2 + " unidades";
                        nuevaNoti.tipoNotificacion = "stockBajo";
                        nuevaNoti.sistema = "ecommerceAdmin";
                        nuevaNoti.leido = false;
                        try {
                            await this.notificacionService_.crear(nuevaNoti);
                            enviarMensajeAdmins("stockBajo", "El producto " + inventario.producto.nombre + " tiene un stock menor a " + inventario.producto.stockSeguridad*2 + " unidades en el motorizado " + inventario.motorizado.usuario.nombre);
                        }
                        catch (error) {
                            console.error("Error al crear notificación", error);
                        }
                    }
                }
            } catch (error) {
                console.error("Error al reducir stock", error);
            }
        }
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Pedido>, "id">,
        asignarRepartidor: boolean = false
    ): Promise<Pedido> {
        return await this.atomicPhase_(async (manager) => {
            const pedidoRepo = manager.withRepository(this.pedidoRepository_);
            const relations = asignarRepartidor ? ["motorizado", "direccion", "direccion.ubicacion"] : ["motorizado", "usuario"];
            const pedido = await this.recuperarConDetalle(id, { relations });
            
            
            if (asignarRepartidor) {
                // console.log("Pedido fetcheado", pedido);
                data.direccion = pedido.direccion;
                const dataRepartidor = await this.asignarRepartidor(manager, data, id, true);
                // console.log("Data de asignación de repartidor: ", dataRepartidor);
                if (dataRepartidor) {
                    data.motorizado = dataRepartidor.motorizado;
                    data.codigoSeguimiento = dataRepartidor.codigoSeguimiento;
                }
            }

            if (pedido.estado !== data.estado) {
                if (data.estado === "entregado") {
                    data.entregadoEn = new Date();
                    estadoPedidos.set(id, "entregado");
                }
                if (data.estado === "verificado") {
                    data.verificadoEn = new Date();
                    estadoPedidos.set(id, "verificado");
                    try {
                        // console.log("Verificando stock con motorizado: ", pedido.motorizado);
                        this.reduceStock(pedido, pedido.motorizado);
                    } catch (error) {
                        console.error("Error al reducir stock, se continúa para la demo", error);
                        // throw new MedusaError(MedusaError.Types.NOT_FOUND, "No hay motorizados disponibles con suficiente stock");
                    }
                }
                if (data.estado === "solicitado") {
                    data.solicitadoEn = new Date();
                }
                if (data.estado === "enProgreso") {
                    estadoPedidos.set(id, "enProgreso");
                }
                if (data.estado === "cancelado") {
                    estadoPedidos.set(id, "cancelado");
                }
                if (data.estado === "manual") {
                    estadoPedidos.set(id, "manual");
                }
                if (data.estado === "fraudulento") {
                    estadoPedidos.set(id, "fraudulento");
                }
            }
            if (data.pagado) {
                data.pagadoEn = new Date();
                try {
                  this.insertarEnCrm(pedido);
                } catch (error) {
                    console.error("Error al insertar en CRM", error);
                }
            }
            // console.log("Motorizado final: ", data.motorizado);
            Object.assign(pedido, data);
            delete pedido.pedidosXMetodoPago;
            return await pedidoRepo.save(pedido);
        });
    }

    async asignarRepartidor(manager, pedido, id, algoritmo=false) {
        const motorizadoRepo = manager.withRepository(this.motorizadoRepository_);
        let repartidoresAConsiderar = ubicacionesDelivery;

        
        if(algoritmo){
            // console.log("Algoritmo de asignación de repartidor");
            const latPedido = pedido.direccion.ubicacion.latitud;
            const lonPedido = pedido.direccion.ubicacion.longitud;
            // console.log("Ubicación del pedido: ", latPedido, lonPedido);
            // Collect distances and counts
            const distancesAndCounts = await Promise.all([...ubicacionesDelivery.entries()].map(async ([motorizadoId, motorizado]) => {
                const lat = motorizado.lat;
                const lon = motorizado.lng;
                const distancia = this.haversineDistance(latPedido, lonPedido, lat, lon);
                if (distancia > 15) {
                    return { motorizadoId, distancia, pedidos: 0 };
                }
                const pedidos = await this.pedidoRepository_.countByMotorizadoId(motorizadoId, ["solicitado", "enProgreso"]);
                console.log("Distancia: ", distancia + " . Se cuentan " + pedidos + " pedidos");
                return { motorizadoId, distancia, pedidos };
            }));
    
            // Sort by distance and count
            const ubicacionesDeliveryOrdenadas = new Map(distancesAndCounts.sort((a, b) => {
                if (Math.abs(a.distancia - b.distancia) < 1) {
                    return a.pedidos - b.pedidos;
                }
                return a.distancia - b.distancia;
            }).map(item => [item.motorizadoId, ubicacionesDelivery.get(item.motorizadoId)]));

            repartidoresAConsiderar = ubicacionesDeliveryOrdenadas;
            console.log("Repartidores a considerar: ", repartidoresAConsiderar);
        }
        
    
        if (repartidoresAConsiderar.size > 0) {
            let motorizadoAsignado = null;
            // console.log("Recorriendo motorizados");
            for (const motorizadoId of repartidoresAConsiderar.keys()) {
                const dataMotorizado = await motorizadoRepo.findOne(buildQuery({ id: motorizadoId }));
                // console.log("Motorizado con id: ", motorizadoId);
                if (dataMotorizado) {
                    // console.log("Motorizado encontrado: ");
                    // console.log("Verificando stock");
                    const hasStock = await this.checkPedido(pedido, dataMotorizado);
                    // console.log("Stock: ", hasStock);
                    if (hasStock || true) { //Eliminar el true para que se verifique el stock
                        console.log("Motorizado con stock encontrado: ", dataMotorizado);
                        motorizadoAsignado = dataMotorizado;
                        break;
                    }
                }
            }
    
            if (motorizadoAsignado) {
                const data: { motorizado: Motorizado; codigoSeguimiento: string } = { motorizado: null, codigoSeguimiento: "" };
                data.motorizado = motorizadoAsignado;
                data.codigoSeguimiento = id.slice(-3) + motorizadoAsignado.id.slice(-3) + (new Date()).getTime().toString().slice(-3);
                // console.log("Codigo de seguimiento: ", data.codigoSeguimiento);
                enviarMensajeRepartidor(motorizadoAsignado.id, "nuevoPedido", id);
                enviarMensajeAdmins("nuevoPedido", id);
                let nuevaNoti = new Notificacion();
                nuevaNoti.asunto = "Nuevo pedido";
                nuevaNoti.descripcion = "El pedido " + data.codigoSeguimiento + " está pendiente de confirmación";
                nuevaNoti.tipoNotificacion = "pedido";
                nuevaNoti.sistema = "ecommerceAdmin";
                nuevaNoti.leido = false;
                try {
                    await this.notificacionService_.crear(nuevaNoti);
                } catch (error) {
                    console.error("Error al crear notificación", error);
                }
                return data;
            } else {
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "No hay motorizados disponibles con suficiente stock");
            }
        } else {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "No hay motorizados disponibles");
        }
    }
    

    async confirmar(id: string): Promise<Pedido> {
        return await this.atomicPhase_(async (manager) => {
            const pedidoRepo = manager.withRepository(this.pedidoRepository_);
            const pedido = await this.recuperar(id);
            pedido.estado = "verificado";
            pedido.verificadoEn = new Date();
            estadoPedidos.delete(id);
            return await pedidoRepo.save(pedido);
        });
    }

    async eliminar(id: string): Promise<Pedido> {
        return await this.atomicPhase_(async (manager) => {
            const pedidoRepo = manager.withRepository(this.pedidoRepository_);
            const pedido = await this.recuperar(id);
            pedido.estaActivo = false;
            pedido.desactivadoEn = new Date();
            return await pedidoRepo.save(pedido);
        });
    }

    async listarPorUsuario(idUsuario: string): Promise<Pedido[]> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const pedidos = await pedidoRepo.encontrarPorUsuarioId(idUsuario);

        if (!pedidos) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedidos;
    }

    async listarPorMotorizado(idMotorizado: string): Promise<Pedido[]> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const pedidos = await pedidoRepo.findByMotorizadoId(idMotorizado);

        if (!pedidos) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedidos;
    }

    async buscarPorCodigoSeguimiento(codigoSeguimiento: string): Promise<Pedido> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const pedido = await pedidoRepo.findByCodigoSeguimiento(codigoSeguimiento);

        if (!pedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedido;
    }

    async encontrarUltimoPorUsuarioId(idUsuario: string): Promise<Pedido> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const pedido = await pedidoRepo.encontrarUltimoPorUsuarioId(idUsuario);

        if (!pedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedido;
    }

    async encontrarUltimoCarritoPorUsuarioId(idUsuario: string): Promise<Pedido> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const pedido = await pedidoRepo.encontrarUltimoCarritoPorUsuarioId(idUsuario);

        if (!pedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedido;
    }

    async encontrarPorUsuarioId(idUsuario: string, selector: Selector<Pedido> = {}): Promise<Pedido[]> {
        const finalSelector: any = selector || {};
        const relations = ["motorizado", "direccion", "direccion.ciudad"];
    
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const query = pedidoRepo.createQueryBuilder("pedido")
            .leftJoinAndSelect("pedido.motorizado", "motorizado")
            .leftJoinAndSelect("pedido.direccion", "direccion")
            .leftJoinAndSelect("direccion.ciudad", "ciudad")
            .where("pedido.usuario.id = :idUsuario", { idUsuario });
    
        if (Array.isArray(finalSelector.estado) && finalSelector.estado.length > 0) {
            query.andWhere("pedido.estado IN (:...estados)", { estados: finalSelector.estado });
        } else if (finalSelector.estado) {
            if (finalSelector.estado === '!= carrito') {
                query.andWhere("pedido.estado != :estado", { estado: 'carrito' });
            } else {
                query.andWhere("pedido.estado = :estado", { estado: finalSelector.estado });
            }
        }
        // console.log(query.getSql(), query.getParameters()); // Log the query and parameters for debugging

        const pedidos = await query.getMany();
    
        if (!pedidos) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedidos no encontrados");
        }
       return pedidos;
    }
    async encontrarUltimoCarritoPorUsuarioIdYTengaAlgunDetalleActivo(idUsuario: string): Promise<Pedido> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const pedido = await pedidoRepo.encontrarUltimoCarritoPorUsuarioIdYTengaAlgunDetalleActivo(idUsuario);

        if (!pedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedido;
    }

    haversineDistance(lat1, lon1, lat2, lon2) {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    }

    async insertarEnCrm(pedido: Pedido): Promise<void> {
        console.log("Insertando en CRM");
        // Verificar si es usuario con cuenta
        if (pedido.usuario.conCuenta) {
            console.log("Usuario con cuenta");
            const username = 'dep2.crm@gmail.com';
            const password = '97FO4nsSpV6UneKW';
            const credentials = Buffer.from(`${username}:${password}`).toString('base64');
            // Hacer post a https://heladeria2.od2.vtiger.com/restapi/vtap/api/addVenta con campos ValorRandom e IdConsumidorCRM
            const bodyData={
                "ValorRandom": Math.random(),
                "IdConsumidorCRM": pedido.usuario.idCRM ?? "4x621"
            }
            // console.log("Body data: ", bodyData);
            let ventaId = null;
            try{
                const response = await fetch('https://heladeria2.od2.vtiger.com/restapi/vtap/api/addVenta', {
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
                // console.log("Venta creada en CRM: ", data);
                ventaId = data.result.id;
            } catch (error) {
                console.error("Error creando venta en CRM: ", error);
            }
            // https://heladeria2.od2.vtiger.com/restapi/vtap/api/addVentaxProduct con campos valorAleatorio, idVentaCRM, idProductoCRM
            for (let detalle of pedido.detalles){
                const bodyData={
                    "valorAleatorio": Math.random(),
                    "idVentaCRM": ventaId,
                    "idProductoCRM": detalle.producto.idCRM ?? "6x626" //Menta por defecto
                }
                // console.log("Body data: ", bodyData);
                try{
                    const response = await fetch('https://heladeria2.od2.vtiger.com/restapi/vtap/api/addVentaxProduct', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${credentials}`,
                        },
                        body: JSON.stringify(bodyData),
                    });
                    const data = await response.json();
                    // console.log("Venta x producto creada en CRM: ", data);
                } catch (error) {
                    console.error("Error creando venta x producto en CRM: ", error);
                }
            }
        } else{
            console.log("Usuario sin cuenta");
        }
        
    }

    async encontrarPorId(id: string): Promise<Pedido> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const pedido = await pedidoRepo.encontrarPorId(id);

        if (!pedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedido;
    }

}

export default PedidoService;
