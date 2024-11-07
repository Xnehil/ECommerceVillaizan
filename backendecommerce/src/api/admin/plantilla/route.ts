import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  PlantillaService  from "@services/Plantilla"
import { Plantilla } from "@models/Plantilla";

/**
 * @swagger
 * tags:
 *   name: Plantilla
 *   description: API para la gestión de plantillas
 */

/**
 * @swagger
 * /plantilla:
 *   get:
 *     summary: Lista todos los plantillaes con paginación
 *     tags: [Plantilla]
 *     parameters:
 *       - in: query
 *         name: enriquecido
 *         schema:
 *           type: boolean
 *         description: Indica si se deben incluir detalles adicionales
 *     responses:
 *       200:
 *         description: Una lista de plantillaes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plantillaes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Plantilla'
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const plantillaService: PlantillaService = req.scope.resolve("plantillaService");
  const { enriquecido } = req.query;

  const plantillas = await plantillaService.listarConPaginacion(
    {},
    {
      skip: 0,
      take: 20,
      relations: enriquecido ? ["productos", "productos.producto"] : [],
    }
  );

  res.json({
    plantillas,
  });
}

  /**
 * @swagger
 * /plantilla:
 *   post:
 *     summary: Crea una nueva ubicación
 *     tags: [Plantilla]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plantilla'
 *     responses:
 *       201:
 *         description: La ubicación ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plantilla'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const plantillaService: PlantillaService = req.scope.resolve("plantillaService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const plantillaData = req.body as Plantilla;
    const plantilla = await plantillaService.crear(plantillaData);

    res.status(201).json({
      plantilla,
    });
  }

  export const AUTHENTICATE = false