import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Notificacion } from "../models/Notificacion";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import NotificacionRepository from "src/repositories/Notificacion";

class NotificacionService extends TransactionBaseService {
    protected notificacionRepository_: typeof NotificacionRepository;

    constructor(container){
        super(container);
        this.notificacionRepository_ = container.notificacionRepository;
    }


    getMessage() {
        return "Hello from NotificacionService";
      }

      async listar(): Promise<Notificacion[]> {
        const notificacionRepo = this.activeManager_.withRepository(this.notificacionRepository_);
        return notificacionRepo.find();
      }
    
      async listarYContar(
        selector: Selector<Notificacion> ={},
        config: FindConfig<Notificacion> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<[Notificacion[], number]> {
        const notificacionRepo = this.activeManager_.withRepository(this.notificacionRepository_);
        const query = buildQuery(selector, config);
        return notificacionRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        selector?: Selector<Notificacion>,
        config: FindConfig<Notificacion> = {
          skip: 0,
          take: 20,
          relations: [],
          order: { creadoEn: "DESC" } // or "DESC" for descending order
      }
      ): Promise<Notificacion[]> {
        const [notificacions] = await this.listarYContar(selector, config);
        return notificacions;
      }

      async listarPorUsuario(idUsuario: string): Promise<Notificacion[]> {
        const notificacionRepo = this.activeManager_.withRepository(this.notificacionRepository_);
        const query = buildQuery(
          { usuario: { id: idUsuario } },
          { order: { creadoEn: "DESC" } } // Sort by creadoEn in descending order
        );
        return notificacionRepo.find(query);
      }
    
      async recuperar(
        id: string,
        config?: FindConfig<Notificacion>
      ): Promise<Notificacion> {
        const notificacionRepo = this.activeManager_.withRepository(this.notificacionRepository_);
        const query = buildQuery({ id }, config);
        const notificacion = await notificacionRepo.findOne(query);
    
        if (!notificacion) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Notificacion no encontrado");
        }
    
        return notificacion;
      }
    
      async crear(notificacion: Notificacion): Promise<Notificacion> {
        return this.atomicPhase_(async (manager) => {
          const notificacionRepo = manager.withRepository(this.notificacionRepository_);
          const notificacionCreado = notificacionRepo.create(notificacion);
          const result = await notificacionRepo.save(notificacionCreado);
          return result;
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<Notificacion>, "id">
      ): Promise<Notificacion> {
        return await this.atomicPhase_(async (manager) => {
          const notificacionRepo = manager.withRepository(this.notificacionRepository_);
          const notificacion = await this.recuperar(id);
          Object.assign(notificacion, data);
          return await notificacionRepo.save(notificacion);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const notificacionRepo = manager.withRepository(this.notificacionRepository_);
          const notificacion = await this.recuperar(id);
          await notificacionRepo.update(id, { desactivadoEn: new Date() , estaActivo: false})
        });
      }

      async contarNoLeidas(id_usuario?: string, rol?: string): Promise<number> {
        const notificacionRepo = this.activeManager_.withRepository(this.notificacionRepository_);
    
        let query = notificacionRepo.createQueryBuilder("notificacion")
          .where("notificacion.leido = :leido", { leido: false });
    
        if (id_usuario) {
          query = query.andWhere("notificacion.id_usuario = :id_usuario", { id_usuario });
        }
    
        if (rol) {
          query = query.andWhere("notificacion.sistema = :sistema", { sistema: `ecommerce${rol}` });
        }
    
        const count = await query.getCount();
        return count;
      }

}

export default NotificacionService;