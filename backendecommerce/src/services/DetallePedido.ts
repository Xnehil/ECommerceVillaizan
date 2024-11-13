import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { DetallePedido } from "../models/DetallePedido";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import detallePedidoRepository from "src/repositories/DetallePedido";
import puntosProductoRepository from "src/repositories/PuntosProducto";

class DetallePedidoService extends TransactionBaseService {
    protected detallePedidoRepository_: typeof detallePedidoRepository;
    protected puntosProductoRepository_: typeof puntosProductoRepository;

    constructor(container) {
        super(container);
        this.detallePedidoRepository_ = container.detallepedidoRepository;
        this.puntosProductoRepository_ = container.puntosproductoRepository;
    }

    getMessage() {
        return "Hello from DetallePedidoService";
    }

    async listar(): Promise<DetallePedido[]> {
        const detallePedidoRepo = this.activeManager_.withRepository(this.detallePedidoRepository_);
        return detallePedidoRepo.find();
    }

    async listarYContar(
        selector: Selector<DetallePedido> = {},
        config: FindConfig<DetallePedido> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[DetallePedido[], number]> {
        const detallePedidoRepo = this.activeManager_.withRepository(this.detallePedidoRepository_);
        const query = buildQuery(selector, config);
        return detallePedidoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<DetallePedido>,
        config: FindConfig<DetallePedido> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<DetallePedido[]> {
        const [detallePedidos] = await this.listarYContar(selector, config);
        return detallePedidos;
    }

    async recuperar(
        id: string,
        config?: FindConfig<DetallePedido>
    ): Promise<DetallePedido> {
        const detallePedidoRepo = this.activeManager_.withRepository(this.detallePedidoRepository_);
        const query = buildQuery({ id }, config);
        const detallePedido = await detallePedidoRepo.findOne({ ...query, relations: ["pedido","producto","promocion"] });

        if (!detallePedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "DetallePedido no encontrado");
        }
        
        return detallePedido;
    }

    async recuperarEnriquecido(id: string): Promise<DetallePedido> {
        const detallePedidoRepo = this.activeManager_.withRepository(this.detallePedidoRepository_);
        const detallePedido = await detallePedidoRepo.findOne({
            where: { id },
            relations: ["pedido","producto","promocion"],
        });

        if (!detallePedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "DetallePedido no encontrado");
        }

        const puntosProductoRepo = this.activeManager_.withRepository(this.puntosProductoRepository_);
        const puntosProducto = await puntosProductoRepo.encontrarPuntosPorProductoActivo(detallePedido.producto.id);
        if(puntosProducto){
            detallePedido.producto.cantidadPuntos = puntosProducto.cantidadPuntos;
        }

        return detallePedido;
    }

    async crear(detallePedido: DetallePedido): Promise<DetallePedido> {
        return this.atomicPhase_(async (manager) => {
            const detallePedidoRepo = manager.withRepository(this.detallePedidoRepository_);
            const detallePedidoCreado = detallePedidoRepo.create(detallePedido);
            const result = await detallePedidoRepo.save(detallePedidoCreado);
            //check for canje puntos
            const puntosProductoRepo = manager.withRepository(this.puntosProductoRepository_);
            const puntosProducto = await puntosProductoRepo.encontrarPuntosPorProductoActivo(result.producto.id);
            if(puntosProducto){
                result.producto.cantidadPuntos = puntosProducto.cantidadPuntos;
            }
            //console.log("result ", result);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<DetallePedido>, "id">
    ): Promise<DetallePedido> {
        return await this.atomicPhase_(async (manager) => {
            const detallePedidoRepo = manager.withRepository(this.detallePedidoRepository_);
            const detallePedido = await detallePedidoRepo.encontrarPorId(id);
            console.log("recuperar detallePedido ", detallePedido);
            Object.assign(detallePedido, data);
            const response = await detallePedidoRepo.save(detallePedido);
    
            const puntosProductoRepo = manager.withRepository(this.puntosProductoRepository_);
            const puntosProducto = await puntosProductoRepo.encontrarPuntosPorProductoActivo(response.producto.id);
    
            if (puntosProducto) {
                response.producto.cantidadPuntos = puntosProducto.cantidadPuntos;
            }
    
            console.log("actualizar response ", response);
            return response;
        });
    }

    async eliminar(id: string): Promise<DetallePedido> {
        return await this.atomicPhase_(async (manager) => {
            const detallePedidoRepo = manager.withRepository(this.detallePedidoRepository_);
            const detallePedido = await detallePedidoRepo.encontrarPorId(id);
            detallePedido.estaActivo = false;
            detallePedido.desactivadoEn = new Date();
            return await detallePedidoRepo.save(detallePedido);
        });
    }
}

export default DetallePedidoService;
