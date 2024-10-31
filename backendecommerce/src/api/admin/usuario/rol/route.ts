import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import UsuarioService from "../../../../services/Usuario";
import { Usuario } from "src/models/Usuario";

interface RolRequestBody {
    nombreRol: string;
}

export const GET = async (
    req: MedusaRequest & { body: RolRequestBody },
    res: MedusaResponse
) => {
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");
    const { nombreRol } = req.body;

    res.json({
        usuarios: await usuarioService.buscarPorRolNombre(nombreRol),
    });
};


export const AUTHENTICATE = false;