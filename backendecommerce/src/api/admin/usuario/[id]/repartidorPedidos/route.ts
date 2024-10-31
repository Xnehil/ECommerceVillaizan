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
 *       - in: query
 *         name: estado
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: false
 *         description: Estado del pedido (e.g., carrito, solicitado, verificado, enProgreso, entregado, cancelado). Si no se especifica, se devuelven todos los pedidos
 *       - in: query
 *         name: enriquecido
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Indica si se deben incluir relaciones adicionales
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
    const enriquecido = req.query.enriquecido === 'true';
    const estado = req.query.estado as string | string[];

    const validEstados = ['carrito', 'solicitado', 'verificado', 'enProgreso', 'entregado', 'cancelado'];
    const filter: { estado?: string | string[] } = {};


    if (Array.isArray(estado)) {
        filter.estado = estado.filter(e => validEstados.includes(e));
    } else if (validEstados.includes(estado)) {
        filter.estado = estado;
    }
    try {
        const pedidos = await usuarioService.listarPedidosRepartidor(id,   filter );
        res.json({ pedidos });
    } catch (error) {
        res.status(404).json({ error: "Pedidos no encontrados" });
    }
};



export const AUTHENTICATE = false;
