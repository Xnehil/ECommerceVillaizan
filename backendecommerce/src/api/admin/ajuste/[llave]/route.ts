import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import AjusteService from "@services/Ajuste";
import { Ajuste } from "src/models/Ajuste";

/**
 * @swagger
 * tags:
 *   name: Ajustes
 *   description: API para la gestión de ajustes
 */

/**
 * @swagger
 * /ajuste/{llave}:
 *   get:
 *     summary: Recupera un ajuste por el nombre de la llave
 *     tags: [Ajustes]
 *     parameters:
 *       - in: path
 *         name: llave
 *         schema:
 *           type: string
 *           enum: [monto_minimo_pedido, permitir_cancelaciones, horario_lunes, horario_martes, horario_miercoles, horario_jueves, horario_viernes, horario_sabado, horario_domingo, tiempo_confirmacion]
 *         required: true
 *         description: Llave del ajuste
 *     responses:
 *       200:
 *         description: Detalles del ajuste
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ajuste'
 *       404:
 *         description: Ajuste no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ajusteService: AjusteService = req.scope.resolve("ajusteService");
    const { llave } = req.params;

    try {
        const ajuste = await ajusteService.recuperar(llave);
        res.json({ ajuste });
    } catch (error) {
        res.status(404).json({ error: "Ajuste no encontrado" });
    }
};

/**
 * @swagger
 * /ajuste/{llave}:
 *   put:
 *     summary: Actualiza un ajuste por llave
 *     tags: [Ajustes]
 *     parameters:
 *       - in: path
 *         name: llave
 *         schema:
 *           type: string
 *         required: true
 *         description: Llave del ajuste
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ajuste'
 *     responses:
 *       200:
 *         description: Ajuste actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ajuste'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Ajuste no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ajusteService: AjusteService = req.scope.resolve("ajusteService");
    const { llave } = req.params;
    const ajusteData = req.body as Partial<Ajuste>;

    try {
        const ajuste = await ajusteService.actualizar(llave, ajusteData);
        res.json({ ajuste });
    } catch (error) {
        if (error.message === "Ajuste no encontrado") {
            res.status(404).json({ error: "Ajuste no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /ajuste/{llave}:
 *   delete:
 *     summary: Elimina un ajuste por llave
 *     tags: [Ajustes]
 *     parameters:
 *       - in: path
 *         name: llave
 *         schema:
 *           type: string
 *         required: true
 *         description: Llave del ajuste
 *     responses:
 *       200:
 *         description: Ajuste eliminado exitosamente
 *       404:
 *         description: Ajuste no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ajusteService: AjusteService = req.scope.resolve("ajusteService");
    const { llave } = req.params;

    try {
        await ajusteService.eliminar(llave);
        res.status(200).json({ message: "Ajuste eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "Ajuste no encontrado" });
    }
};

export const AUTHENTICATE = false;
