import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import UsuarioService from "../../../services/Usuario";
import { Usuario } from "src/models/Usuario";

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para la gestión de usuarios
 */

/**
 * @swagger
 * /usuario:
 *   get:
 *     summary: Lista todos los usuarios con paginación
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Una lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");

    res.json({
        usuarios: await usuarioService.listarConPaginacion(),
    });
};

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuario]
 *     parameters:
 *     - in: query
 *       name: revisar
 *       schema:
 *         type: boolean
 *       required: false
 *       description: Si se debe recuperar el usuario revisar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: El usuario ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Petición inválida
 */

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");
    const revisar = req.query.revisar === 'true';

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const usuarioData = req.body as Usuario;
    if(revisar){
        const respuesta = await usuarioService.buscarPorCorreo(usuarioData.correo);
        if(respuesta){
            res.status(400).json({error: "Este correo ya tiene una cuenta asociada"});
            return;
        }
    }

    
    const usuario = await usuarioService.crear(usuarioData);

    res.json({
        usuario,
    });
};

export const AUTHENTICATE = false;
