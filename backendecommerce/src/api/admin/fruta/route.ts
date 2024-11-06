import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  FrutaService  from "../../../services/Fruta"
import { Fruta } from "src/models/Fruta";

/**
 * @swagger
 * tags:
 *  name: Frutas
 * description: API para frutas
 * 
  */


/**
 * @swagger
 * /frutas:
 *   get:
 *     summary: Lista todas las frutas con paginación o una fruta aleatoria
 *     tags: [Frutas]
 *     parameters:
 *       - in: query
 *         name: random
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Indica si se debe devolver una fruta aleatoria
 *     responses:
 *       200:
 *         description: Una lista de frutas o una fruta aleatoria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 frutas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Fruta'
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const frutaService: FrutaService = req.scope.resolve("frutaService");
  const { random } = req.query;

  if (random === 'true') {
    const frutas = await frutaService.listarConPaginacion();
    const randomFruta = frutas[Math.floor(Math.random() * frutas.length)];
    return res.json({
      frutas: [randomFruta],
    });
  }

  res.json({
    frutas: await frutaService.listarConPaginacion(),
  });
};

  /**
 * @swagger
 * /frutas:
 *   post:
 *     summary: Crea una nueva fruta
 *     tags: [Frutas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fruta'
 *     responses:
 *       201:
 *         description: La fruta ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fruta'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const frutaService: FrutaService = req.scope.resolve("frutaService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const frutaData = req.body as Fruta;
    const fruta = await frutaService.crear(frutaData);

    res.status(201).json({
      fruta,
    });
  }

  export const AUTHENTICATE = false