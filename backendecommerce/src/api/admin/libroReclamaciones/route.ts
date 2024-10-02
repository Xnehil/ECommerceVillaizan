import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  LibroReclamacionesService  from "../../../services/LibroReclamaciones"
import { LibroReclamaciones } from "src/models/LibroReclamaciones";

/**
 * @swagger
 * tags:
 *   name: LibroReclamaciones
 *   description: API para la gestión de libros de reclamaciones
 */

/**
 * @swagger
 * /libroreclamaciones:
 *   get:
 *     summary: Lista todos los libros de reclamaciones con paginación
 *     tags: [LibroReclamaciones]
 *     responses:
 *       200:
 *         description: Una lista de libros de reclamaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 libroreclamaciones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LibroReclamaciones'
 */

  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const libroReclamacionesService: LibroReclamacionesService = req.scope.resolve("libroreclamacionesService");

    res.json({
      libroReclamacioness: await libroReclamacionesService.listarConPaginacion(),
    })
  }

/**
 * @swagger
 * /libro-reclamaciones:
 *   post:
 *     summary: Crea un nuevo libro de reclamaciones
 *     tags: [LibroReclamaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LibroReclamaciones'
 *     responses:
 *       201:
 *         description: El libro de reclamaciones ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibroReclamaciones'
 *       400:
 *         description: Petición inválida
 */

  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const libroReclamacionesService: LibroReclamacionesService = req.scope.resolve("libroreclamacionesService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const libroReclamacionesData = req.body as LibroReclamaciones;
    const libroReclamaciones = await libroReclamacionesService.crear(libroReclamacionesData);

    res.json({
      libroReclamaciones,
    });
  }

  export const AUTHENTICATE = false