import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  DireccionService  from "../../../../../services/Direccion"
import { Direccion } from "src/models/Direccion";

/**
 * @swagger
 * /direccion/usuario/{id}:
 *   get:
 *     summary: Retrieve user addresses
 *     description: Retrieve addresses for a user by their ID. Optionally, retrieve enriched addresses.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *       - in: query
 *         name: guardada
 *         required: false
 *         description: Flag to retrieve enriched addresses
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: A list of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 direcciones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Direccion'
 *       404:
 *         description: Addresses not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const direccionService: DireccionService = req.scope.resolve("direccionService");
    const id = req.params.id;
    const guardada = req.query.guardada === 'true';

    try {
        const direcciones = guardada ? await direccionService.listarPorUsuarioIdGuardados(id) : await direccionService.listarPorUsuarioId(id);
        res.json({ direcciones });
    } catch (error) {
        res.status(404).json({ error: "direcciones no encontradas" });
    }
};

export const AUTHENTICATE = false