import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Persona } from "../models/Persona";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import personaRepository from "src/repositories/Persona";

class PersonaService extends TransactionBaseService {
    protected personaRepository_: typeof personaRepository;

    constructor(container) {
        super(container);
        this.personaRepository_ = container.personaRepository;
    }

    getMessage() {
        return "Hello from PersonaService";
    }

    async listar(): Promise<Persona[]> {
        const personaRepo = this.activeManager_.withRepository(this.personaRepository_);
        return personaRepo.find();
    }

    async listarYContar(
        selector: Selector<Persona> = {},
        config: FindConfig<Persona> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Persona[], number]> {
        const personaRepo = this.activeManager_.withRepository(this.personaRepository_);
        const query = buildQuery(selector, config);
        return personaRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Persona>,
        config: FindConfig<Persona> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Persona[]> {
        const [personas] = await this.listarYContar(selector, config);
        return personas;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Persona>
    ): Promise<Persona> {
        const personaRepo = this.activeManager_.withRepository(this.personaRepository_);
        const query = buildQuery({ id }, config);
        const persona = await personaRepo.findOne(query);

        if (!persona) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Persona no encontrada");
        }

        return persona;
    }

    async crear(persona: Persona): Promise<Persona> {
        return this.atomicPhase_(async (manager) => {
            const personaRepo = manager.withRepository(this.personaRepository_);
            const personaCreada = personaRepo.create(persona);
            const result = await personaRepo.save(personaCreada);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Persona>, "id">
    ): Promise<Persona> {
        return await this.atomicPhase_(async (manager) => {
            const personaRepo = manager.withRepository(this.personaRepository_);
            const persona = await this.recuperar(id);
            Object.assign(persona, data);
            return await personaRepo.save(persona);
        });
    }

    async eliminar(id: string): Promise<Persona> {
        return await this.atomicPhase_(async (manager) => {
            const personaRepo = manager.withRepository(this.personaRepository_);
            const persona = await this.recuperar(id);
            persona.estaActivo = false;
            persona.desactivadoEn = new Date();
            return await personaRepo.save(persona);
        });
    }
}

export default PersonaService;
