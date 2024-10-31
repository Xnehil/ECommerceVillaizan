import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Pedido } from "../models/Pedido";
import { Not, Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import pedidoRepository from "src/repositories/Pedido";
import { ubicacionesDelivery, estadoPedidos, enviarMensajeRepartidor, enviarMensajeAdmins } from "../loaders/websocketLoader";
import MotorizadoRepository from "@repositories/Motorizado";
import { Motorizado } from "@models/Motorizado";
import InventarioMotorizadoRepository from "@repositories/InventarioMotorizado";
import { InventarioMotorizado } from "@models/InventarioMotorizado";
import { Notificacion } from "../models/Notificacion";
import NotificacionService from "./Notificacion";


class PedidoService extends TransactionBaseService {
    protected pedidoRepository_: typeof pedidoRepository;
    protected motorizadoRepository_: typeof MotorizadoRepository;
    protected inventarioMotorizadoRepository_: typeof InventarioMotorizadoRepository;
    protected notificacionService_: NotificacionService

    constructor(container) {
        super(container);
        this.pedidoRepository_ = container.pedidoRepository;
        this.motorizadoRepository_ = container.motorizadoRepository;
        this.inventarioMotorizadoRepository_ = container.inventariomotorizadoRepository;
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
        const pedido = await pedidoRepo.findOne(query);

        if (!pedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedido;
    }

    async recuperarConDetalle(id: string, options: FindConfig<Pedido> = {}): Promise<Pedido> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const relations = ["detalles", "detalles.producto", ...(options.relations || [])];
        const query = buildQuery({ id }, { relations });
        const pedido = await pedidoRepo.findOne(query);
    
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
            const inventario = inventarios.find((inv) => inv.producto.id === detalle.producto.id);
            if (inventario) {
                inventario.stock -= detalle.cantidad;
                await invetarioMotorizadoRepo.save(inventario);
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
            const relations = asignarRepartidor ? ["motorizado", "direccion"] : [];
            const pedido = await this.recuperarConDetalle(id, { relations });
            let tienestock : boolean = false;

            //log ubicacionesDelivery
            console.log(ubicacionesDelivery);
    
            if (asignarRepartidor) {
                const motorizadoRepo = manager.withRepository(this.motorizadoRepository_);
    
                if (ubicacionesDelivery.size > 0) {
                    let motorizadoAsignado = null;
                    console.log("Recorriendo motorizados");
                    for (const motorizadoId of ubicacionesDelivery.keys()) {
                        const dataMotorizado = await motorizadoRepo.findOne(buildQuery({ id: motorizadoId }));
                        console.log("Motorizado con id: ", motorizadoId);
                        if (dataMotorizado) {
                            console.log("Motorizado encontrado: ");
                            console.log("Verificando stock");
                            const hasStock = await this.checkPedido(pedido, dataMotorizado);
                            // const mismaCiudad = dataMotorizado.ciudad.id === pedido.direccion.ciudad.id;
                            console.log("Stock: ", hasStock);
                            if (hasStock || true ) { //Eliminar el true para que se verifique el stock
                                console.log("Motorizado con stock encontrado");
                                motorizadoAsignado = dataMotorizado;
                                tienestock = true;
                                break;
                            }
                        }
                    }
    
                    if (motorizadoAsignado) {
                        data.motorizado = motorizadoAsignado;
                        try {
                            this.reduceStock(pedido, motorizadoAsignado);
                        } catch (error) {
                            console.error("Error al reducir stock, se continúa para la demo", error);
                            // throw new MedusaError(MedusaError.Types.NOT_FOUND, "No hay motorizados disponibles con suficiente stock");
                        }
                        data.codigoSeguimiento = id.slice(-3) + motorizadoAsignado.id.slice(-3)+(new Date()).getTime().toString().slice(-3);
                        console.log("Codigo de seguimiento: ", data.codigoSeguimiento);
                        enviarMensajeRepartidor(motorizadoAsignado.id, "nuevoPedido", id);
                        enviarMensajeAdmins("nuevoPedido", id);
                        let nuevaNoti = new Notificacion();
                        nuevaNoti.asunto = "Nuevo pedido";
                        nuevaNoti.descripcion = "El pedido " + id + " está pendiente de confirmación";
                        nuevaNoti.tipoNotificacion = "pedido";
                        nuevaNoti.sistema = "ecommerceAdmin";
                        nuevaNoti.leido = false;
                        try {
                            await this.notificacionService_.crear(nuevaNoti);
                        }
                        catch (error) {
                            console.error("Error al crear notificación", error);
                        }
                    } else {
                        throw new MedusaError(MedusaError.Types.NOT_FOUND, "No hay motorizados disponibles con suficiente stock");
                    }
                } else {
                    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No hay motorizados disponibles");
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
                }
                if (data.estado === "solicitado") {
                    data.solicitadoEn = new Date();
                }
                if (data.estado === "enProgreso") {
                    estadoPedidos.set(id, "enProgreso");
                }
            }
            console.log("Se llegó a la parte de actualizar");
            Object.assign(pedido, data);
            return await pedidoRepo.save(pedido);
        });
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

}

export default PedidoService;
