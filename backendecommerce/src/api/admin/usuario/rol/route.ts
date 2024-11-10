import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import UsuarioService from "../../../../services/Usuario";
import { Usuario } from "src/models/Usuario";

/**
 * @swagger
 * /usuario/rol:
 *   post:
 *     summary: Buscar usuarios por nombre de rol
 *     description: Retorna una lista de usuarios que tienen el rol especificado.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreRol:
 *                 type: string
 *                 description: El nombre del rol a buscar.
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Lista de usuarios con el rol especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Solicitud incorrecta.
 *       500:
 *         description: Error interno del servidor.
 */

interface RolRequestBody {
    nombreRol: string;
}

export const POST = async (
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