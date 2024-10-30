

import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import UsuarioService from "../../../../../services/Usuario";
import { Usuario } from "src/models/Usuario";


interface NuevoPswdRequestBody {
    nuevoPswd: string;
}

export const POST = async (
    req: MedusaRequest & { body: NuevoPswdRequestBody },
    res: MedusaResponse
) => {
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");
    const { nuevoPswd } = req.body;
    const id = req.params.id;

    try {
        const usuario = await usuarioService.cambiarContrasena(id, nuevoPswd);
        res.json({ usuario });
    } catch (error) {
        res.status(404).json({ error: "Usuario no encontrado" });
    }
};

export const AUTHENTICATE = false;