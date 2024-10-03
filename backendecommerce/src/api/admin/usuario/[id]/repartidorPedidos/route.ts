import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import UsuarioService from "../../../../../services/Usuario";
import { Usuario } from "src/models/Usuario";

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para la gestión de usuarios
 */

/**
 * @swagger
 * /usuario/{id_usuario}/repartidorPedidos:
 *   get:
 *     summary: Lista todos los pedidos asignados a un repartidor
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del repartidor
 *     responses:
 *       200:
 *         description: Una lista de pedidos del repartidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedidos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedidos no encontrados
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");
    const { id } = req.params;

    try {
        const pedidos = await usuarioService.listarPedidosRepartidor(id);
        res.json({ pedidos });
    } catch (error) {
        res.status(404).json({ error: "Pedidos no encontrados" });
    }
};



export const AUTHENTICATE = false;
