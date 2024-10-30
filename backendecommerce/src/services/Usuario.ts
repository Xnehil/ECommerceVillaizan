import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Usuario } from "../models/Usuario";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import usuarioRepository from "src/repositories/Usuario";
import MotorizadoRepository from "@repositories/Motorizado";
import PedidoRepository from "@repositories/Pedido";
import PersonaRepository from "@repositories/Persona";
import { Pedido } from "../models/Pedido";
import * as bcrypt from 'bcrypt';
import { Persona } from "../models/Persona";
import RolRepository from "@repositories/Rol";
import { Rol } from "@models/Rol";

class UsuarioService extends TransactionBaseService {
    protected usuarioRepository_: typeof usuarioRepository;
    protected motorizadoRepository_: typeof MotorizadoRepository;
    protected pedidoRepository_: typeof PedidoRepository;
    protected personaRepository_: typeof PersonaRepository;
    protected rolRepository_: typeof RolRepository;

    constructor(container) {
        super(container);
        this.usuarioRepository_ = container.usuarioRepository;
        this.motorizadoRepository_ = container.motorizadoRepository;
        this.pedidoRepository_ = container.pedidoRepository;
        this.personaRepository_ = container.personaRepository;
        this.rolRepository_ = container.rolRepository;
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

    async recuperarPorCorreo(
        correo: string,
        config?: FindConfig<Usuario>
    ): Promise<Usuario> {
        const usuarioRepo = this.activeManager_.withRepository(this.usuarioRepository_);
        const query = buildQuery({ correo }, config);
        const usuario = await usuarioRepo.findOne(query);

        if (!usuario) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Usuario no encontrado");
        }

        return usuario;
    }

    async cambiarContrasena(
        id: string,
        nuevaContrasena: string
    ): Promise<Usuario> {
        return this.atomicPhase_(async (manager) => {
            const usuarioRepo = manager.withRepository(this.usuarioRepository_);
            const usuario = await this.recuperar(id);
            const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
            usuario.contrasena = hashedPassword;
            return await usuarioRepo.save(usuario);
        });
    }

    async crear(usuario: Usuario): Promise<Usuario> {
        const hashedPassword = await bcrypt.hash(usuario.contrasena, 10);
        usuario.contrasena = hashedPassword;

        const personaRepo = this.activeManager_.withRepository(this.personaRepository_);
        let persona : Persona = usuario.persona;
        if(!persona){
            persona = new Persona();
            persona.estado = "activo";
            persona.estaActivo = true;
            persona.usuarioCreacion = "2B"
            const personaBD = personaRepo.create(persona);
            usuario.persona = personaBD;
        }

        let rol : Rol = usuario.rol;
        if(!rol){
            const rolRepo = this.activeManager_.withRepository(this.rolRepository_);
            rol = await rolRepo.findByNombre("Cliente");
            usuario.rol = rol;
        }
                
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

    async listarPedidosRepartidor(id_usuario: string): Promise<Pedido[]> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const motorizado = await motorizadoRepo.encontrarPorUsuarioId(id_usuario);
        if (!motorizado) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Motorizado no encontrado");
        }
        const pedidos = await pedidoRepo.findByMotorizadoId(motorizado.id);
        if (!pedidos) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedidos no encontrados");
        }
        return pedidos;
    }

    async buscarPorCorreo(correo: string): Promise<Usuario> {
        const usuarioRepo = this.activeManager_.withRepository(this.usuarioRepository_);
        const usuario = usuarioRepo.findByEmail(correo);
        if (!usuario) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Usuario no encontrado");
        }
        return usuario;
    }

}

export default UsuarioService;
