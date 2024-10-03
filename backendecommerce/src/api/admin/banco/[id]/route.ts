import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import BancoService from "../../../../services/Banco";
import { Banco } from "src/models/Banco";

/**
 * @swagger
 * tags:
 *   name: Bancos
 *   description: API para la gestión de bancos
 */

/**
 * @swagger
 * /banco/{id}:
 *   get:
 *     summary: Recupera un banco por ID
 *     tags: [Bancos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del banco
 *     responses:
 *       200:
 *         description: Detalles del banco
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banco'
 *       404:
 *         description: Banco no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const bancoService: BancoService = req.scope.resolve("bancoService");
    const { id } = req.params;

    try {
        const banco = await bancoService.recuperar(id);
        res.json({ banco });
    } catch (error) {
        res.status(404).json({ error: "Banco no encontrado" });
    }
};

/**
 * @swagger
 * /banco/{id}:
 *   put:
 *     summary: Actualiza un banco por ID
 *     tags: [Bancos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del banco
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Banco'
 *     responses:
 *       200:
 *         description: Banco actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banco'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Banco no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const bancoService: BancoService = req.scope.resolve("bancoService");
    const { id } = req.params;
    const bancoData = req.body as Partial<Banco>;

    try {
        const banco = await bancoService.actualizar(id, bancoData);
        res.json({ banco });
    } catch (error) {
        if (error.message === "Banco no encontrado") {
            res.status(404).json({ error: "Banco no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /banco/{id}:
 *   delete:
 *     summary: Elimina un banco por ID
 *     tags: [Bancos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del banco
 *     responses:
 *       200:
 *         description: Banco eliminado exitosamente
 *       404:
 *         description: Banco no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const bancoService: BancoService = req.scope.resolve("bancoService");
    const { id } = req.params;

    try {
        await bancoService.eliminar(id);
        res.status(200).json({ message: "Banco eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "Banco no encontrado" });
    }
};

export const AUTHENTICATE = false;
