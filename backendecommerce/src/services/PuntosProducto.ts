import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { PuntosProducto } from "../models/PuntosProducto";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import PuntosProductoRepository from "src/repositories/PuntosProducto";

class PuntosProductoService extends TransactionBaseService {
    protected puntosProductoRepository_: typeof PuntosProductoRepository;

    constructor(container){
        super(container);
        this.puntosProductoRepository_ = container.puntosproductoRepository;
    }

    getMessage() {
        return "Hello from PuntosProductoService";
    }

    async listar(): Promise<PuntosProducto[]> {
        const puntosProductoRepo = this.activeManager_.withRepository(this.puntosProductoRepository_);
        return puntosProductoRepo.find();
    }

    async listarYContar(
        selector: Selector<PuntosProducto> ={},
        config: FindConfig<PuntosProducto> = {
          skip: 0,
          take: 20,
          relations: [],
        }
    ): Promise<[PuntosProducto[], number]> {
        const puntosProductoRepo = this.activeManager_.withRepository(this.puntosProductoRepository_);
        const query = buildQuery(selector, config);
        return puntosProductoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<PuntosProducto>,
        config: FindConfig<PuntosProducto> = {
          skip: 0,
          take: 20,
          relations: [],
        }
    ): Promise<PuntosProducto[]> {
        const [puntosProductos] = await this.listarYContar(selector, config);
        return puntosProductos;
    }

    async recuperar(
        id: string,
        config?: FindConfig<PuntosProducto>
    ): Promise<PuntosProducto> {
        const puntosProductoRepo = this.activeManager_.withRepository(this.puntosProductoRepository_);
        const query = buildQuery({ id }, config);
        const puntosProducto = await puntosProductoRepo.findOne(query);

        if (!puntosProducto) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "PuntosProducto no encontrado");
        }

        return puntosProducto;
    }

    async crear(puntosProducto: PuntosProducto): Promise<PuntosProducto> {
        return this.atomicPhase_(async (manager) => {
          const puntosProductoRepo = manager.withRepository(this.puntosProductoRepository_);
          const puntosProductoCreado = puntosProductoRepo.create(puntosProducto);
          const result = await puntosProductoRepo.save(puntosProductoCreado);
          return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<PuntosProducto>, "id">
    ): Promise<PuntosProducto> {
        return await this.atomicPhase_(async (manager) => {
          const puntosProductoRepo = manager.withRepository(this.puntosProductoRepository_);
          const puntosProducto = await this.recuperar(id);
          Object.assign(puntosProducto, data);
          return await puntosProductoRepo.save(puntosProducto);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const puntosProductoRepo = manager.withRepository(this.puntosProductoRepository_);
          const puntosProducto = await this.recuperar(id);
          //Cambiar sprint
          await puntosProductoRepo.update(id, {estado: false, fechaInactivo: new Date()})
        });
    }

    async encontrarPuntosPorProductoActivo(idProducto: string): Promise<PuntosProducto> {
        const puntosProductoRepo = this.activeManager_.withRepository(this.puntosProductoRepository_);
        const puntosProducto = puntosProductoRepo.encontrarPuntosPorProductoActivo(idProducto);
        if(!puntosProducto){
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "PuntosProducto no encontrado");
        }
        return puntosProducto;
    }
}

export default PuntosProductoService;