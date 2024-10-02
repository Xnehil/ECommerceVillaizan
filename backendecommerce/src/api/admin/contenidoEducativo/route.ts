import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  ContenidoEducativoService  from "../../../services/ContenidoEducativo"
import { ContenidoEducativo } from "src/models/ContenidoEducativo";
/**
 * @swagger
 * tags:
 *   name: ContenidosEducativos
 *   description: API para la gestión de contenidos educativos
 */

/**
 * @swagger
 * /contenidoseducativos:
 *   get:
 *     summary: Lista todos los contenidos educativos con paginación
 *     tags: [ContenidosEducativos]
 *     responses:
 *       200:
 *         description: Una lista de contenidos educativos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contenidoEducativos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContenidoEducativo'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const contenidoEducativoService: ContenidoEducativoService = req.scope.resolve("contenidoeducativoService");

    res.json({
      contenidoEducativos: await contenidoEducativoService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /contenidoseducativos:
 *   post:
 *     summary: Crea un nuevo contenido educativo
 *     tags: [ContenidosEducativos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContenidoEducativo'
 *     responses:
 *       201:
 *         description: El contenido educativo ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContenidoEducativo'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const contenidoEducativoService: ContenidoEducativoService = req.scope.resolve("contenidoeducativoService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const contenidoEducativoData = req.body as ContenidoEducativo;
    const contenidoEducativo = await contenidoEducativoService.crear(contenidoEducativoData);

    res.status(201).json({
      contenidoEducativo,
    });
  }

  export const AUTHENTICATE = false