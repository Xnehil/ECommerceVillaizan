import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import UsuarioService from "../../../../services/Usuario";
import { Usuario } from "src/models/Usuario";

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para la gestión de usuarios
 */

/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Recupera un usuario por ID o correo
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario o correo
 *       - in: query
 *         name: esCorreo
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Indica si el ID es un correo
 *       - in: header
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: La contraseña del usuario
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

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");
    const { id } = req.params;
    const { esCorreo } = req.query;
    const password = req.headers['password'] as string;

    try {
        let usuario;
        if (esCorreo === 'true') {
            if (password) {
                let validado = await usuarioService.autenticar(id, password);
                if (!validado) {
                    return res.status(401).json({ error: "Contraseña incorrecta" });
                }
                else {
                    return res.status(200).json({ message: "Contraseña correcta" });
                }

            } else {
               usuario = await usuarioService.recuperarPorCorreo(id);
            }
        } else {
            usuario = await usuarioService.recuperar(id);
        }

        //console.log("Usuario: ", usuario);

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }



        res.json({ usuario });
    } catch (error) {
        res.status(404).json({ error: "Usuario no encontrado" });
    }
};

/**
 * @swagger
 * /usuario/{id}:
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
 * /usuario/{id}:
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
