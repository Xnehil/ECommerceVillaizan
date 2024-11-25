import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Motorizado } from "../models/Motorizado";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import motorizadoRepository from "src/repositories/Motorizado";
import PedidoRepository from "@repositories/Pedido";
import NotificacionService from "./Notificacion";
import { Notificacion } from "../models/Notificacion";
import { enviarMensajeAdmins } from "../loaders/websocketLoader";

class MotorizadoService extends TransactionBaseService {
    protected motorizadoRepository_: typeof motorizadoRepository;
    protected pedidoRepository_: typeof PedidoRepository;
    protected notificacionService_: NotificacionService;

    constructor(container) {
        super(container);
        this.motorizadoRepository_ = container.motorizadoRepository;
        this.pedidoRepository_ = container.pedidoRepository;
        this.notificacionService_ = container.notificacionService;
    }

    getMessage() {
        return "Hello from MotorizadoService";
    }

    async listar(): Promise<Motorizado[]> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        return motorizadoRepo.find();
    }

    async listarYContar(
        selector: Selector<Motorizado> = {},
        config: FindConfig<Motorizado> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Motorizado[], number]> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const query = buildQuery(selector, config);
        return motorizadoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Motorizado>,
           config: FindConfig<Motorizado> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Motorizado[]> {
        const [motorizados] = await this.listarYContar(selector, config);
        return motorizados;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Motorizado>
    ): Promise<Motorizado> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const query = buildQuery({ id }, config);
        const motorizado = await motorizadoRepo.findOne(query);

        if (!motorizado) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Motorizado no encontrado");
        }

        return motorizado;
    }

    async crear(motorizado: Motorizado): Promise<Motorizado> {
        return this.atomicPhase_(async (manager) => {
            const motorizadoRepo = manager.withRepository(this.motorizadoRepository_);
            const motorizadoCreado = motorizadoRepo.create(motorizado);
            const result = await motorizadoRepo.save(motorizadoCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Motorizado>, "id">
    ): Promise<Motorizado> {
        return await this.atomicPhase_(async (manager) => {
            const motorizadoRepo = manager.withRepository(this.motorizadoRepository_);
            const motorizado = await this.recuperar(id);
            // Si pasa de true a false, se pasan sus pedidos a manual
            if (motorizado.disponible && !data.disponible) {
                await this.pasarPedidosAManual(motorizado);

            }
            Object.assign(motorizado, data);
            return await motorizadoRepo.save(motorizado);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const motorizadoRepo = manager.withRepository(this.motorizadoRepository_);
            const motorizado = await this.recuperar(id);
            await motorizadoRepo.update(id, { estaActivo: false , desactivadoEn: new Date() });
        });
    }

    async listarPorUsuarioId(id_usuario: string): Promise<Motorizado> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const motorizado = await motorizadoRepo.encontrarPorUsuarioId(id_usuario);
        if (!motorizado) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Motorizado no encontrado");
        }
        return motorizado;
    }

    async encontrarPorPlaca(placa: string): Promise<Motorizado> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const motorizado = await motorizadoRepo.encontrarPorPlaca(placa);
        if (!motorizado) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Motorizado no encontrado");
        }
        return motorizado;
    }

    async recuperarMotorizadosConDetalle(id: string, options: FindConfig<Motorizado> = {}): Promise<Motorizado> {
        const pedidoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const relations = ["inventarios", ...(options.relations || [])];
        const query = buildQuery({ id }, { relations });
        const pedido = await pedidoRepo.findOne(query);
    
        if (!pedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }
    
        return pedido;
    }

    async recuperarListaMotorizadosConDetalle(options: FindConfig<Motorizado> = {}): Promise<Motorizado[]> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const relations = ["inventarios", ...(options.relations || [])];
        const query = buildQuery({}, { relations });
        const motorizados = await motorizadoRepo.find(query);
    
        if (!motorizados || motorizados.length === 0) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "No se encontraron motorizados");
        }
    
        return motorizados;
    }

    async pasarPedidosAManual(motorizado : Motorizado): Promise<void> {
        console.log("Pasando pedidos a manual");
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const pedidos = await pedidoRepo.findByMotorizadoId(motorizado.id, ["solicitado", "verificado", "enProgreso"]);
        console.log("Se van a pasar " + pedidos.length + " pedidos a manual");
        const motorizadoConUsuario = await this.recuperar(motorizado.id, { relations: ["usuario"] });
        for (const pedido of pedidos) {
            pedido.estado = "manual";
        }
        try {
            await pedidoRepo.save(pedidos);
        } catch (error) {
            console.error("Error al pasar pedidos a manual", error);
        }
        // Enviar notificación al admin
        try{
            let nuevaNoti = new Notificacion();
            nuevaNoti.asunto = "Motorizado no disponible";
            nuevaNoti.descripcion = "El motorizado " + motorizadoConUsuario.usuario.nombre + " con placa " + motorizado.placa + " se ha marcado como no disponible. Llámalo al "+ (motorizadoConUsuario.usuario.numeroTelefono ?? "901320560") +" para verificar su estado y revisa sus pedidos.";
            nuevaNoti.tipoNotificacion = "motorizadoOffline";
            nuevaNoti.sistema ="ecommerceAdmin";
            await this.notificacionService_.crear(nuevaNoti);
            enviarMensajeAdmins("motorizadoOffline", JSON.stringify(nuevaNoti));
        } catch (error) {
            console.error("Error al enviar notificación de motorizado offline", error);
        }
    }
}

export default MotorizadoService;
