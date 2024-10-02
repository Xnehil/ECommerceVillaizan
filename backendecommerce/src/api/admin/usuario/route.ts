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

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const usuarioData = req.body as Usuario;
    const usuario = await usuarioService.crear(usuarioData);

    res.json({
        usuario,
    });
};

/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Recupera un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */

export const GET_BY_ID = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");
    const { id } = req.params;

    try {
        const usuario = await usuarioService.recuperar(id);
        res.json({ usuario });
    } catch (error) {
        res.status(404).json({ error: "Usuario no encontrado" });
    }
};

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Usuario no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");
    const { id } = req.params;
    const usuarioData = req.body as Partial<Usuario>;

    try {
        const usuario = await usuarioService.actualizar(id, usuarioData);
        res.json({ usuario });
    } catch (error) {
        if (error.message === "Usuario no encontrado") {
            res.status(404).json({ error: "Usuario no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");
    const { id } = req.params;

    try {
        const usuario = await usuarioService.eliminar(id);
        res.status(200).json({ message: "Usuario eliminado exitosamente", usuario });
    } catch (error) {
        res.status(404).json({ error: "Usuario no encontrado" });
    }
};



export const AUTHENTICATE = false;
