import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Usuario } from "../models/Usuario";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import usuarioRepository from "src/repositories/Usuario";

class UsuarioService extends TransactionBaseService {
    protected usuarioRepository_: typeof usuarioRepository;

    constructor(container) {
        super(container);
        this.usuarioRepository_ = container.usuarioRepository;
    }

    getMessage() {
        return "Hello from UsuarioService";
    }

    async listar(): Promise<Usuario[]> {
        const usuarioRepo = this.activeManager_.withRepository(this.usuarioRepository_);
        return usuarioRepo.find();
    }

    async listarYContar(
        selector: Selector<Usuario> = {},
        config: FindConfig<Usuario> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Usuario[], number]> {
        const usuarioRepo = this.activeManager_.withRepository(this.usuarioRepository_);
        const query = buildQuery(selector, config);
        return usuarioRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Usuario>,
        config: FindConfig<Usuario> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Usuario[]> {
        const [usuarios] = await this.listarYContar(selector, config);
        return usuarios;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Usuario>
    ): Promise<Usuario> {
        const usuarioRepo = this.activeManager_.withRepository(this.usuarioRepository_);
        const query = buildQuery({ id }, config);
        const usuario = await usuarioRepo.findOne(query);

        if (!usuario) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Usuario no encontrado");
        }

        return usuario;
    }

    async crear(usuario: Usuario): Promise<Usuario> {
        return this.atomicPhase_(async (manager) => {
            const usuarioRepo = manager.withRepository(this.usuarioRepository_);
            const usuarioCreado = usuarioRepo.create(usuario);
            const result = await usuarioRepo.save(usuarioCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Usuario>, "id">
    ): Promise<Usuario> {
        return await this.atomicPhase_(async (manager) => {
            const usuarioRepo = manager.withRepository(this.usuarioRepository_);
            const usuario = await this.recuperar(id);
            Object.assign(usuario, data);
            return await usuarioRepo.save(usuario);
        });
    }

    async eliminar(id: string): Promise<Usuario> {
        return await this.atomicPhase_(async (manager) => {
            const usuarioRepo = manager.withRepository(this.usuarioRepository_);
            const usuario = await this.recuperar(id);
            usuario.estaActivo = false;
            usuario.desactivadoEn = new Date();
            return await usuarioRepo.save(usuario);
        });
    }
}

export default UsuarioService;