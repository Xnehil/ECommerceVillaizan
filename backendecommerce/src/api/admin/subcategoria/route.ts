import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  SubcategoriaService  from "../../../services/Subcategoria"
import { Subcategoria } from "src/models/Subcategoria";

/**
 * @swagger
 * tags:
 *   name: Subcategoria
 *   description: API para subcategorías 
 */

/**
 * @swagger
 * /subcategoria:
 *   get:
 *     summary: Lista de subcategorias con paginación (20 elementos por página)
 *     tags: [Subcategoria]
 *     responses:
 *       200:
 *         description: A list of subcategorias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subcategorias:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subcategoria'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const subcategoriaService: SubcategoriaService = req.scope.resolve("subcategoriaService");

    res.json({
      subcategorias: await subcategoriaService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /subcategoria:
 *   post:
 *     summary: Crear una subcategoria
 *     tags: [Subcategoria]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subcategoria'
 *     responses:
 *       201:
 *         description: La subcategoria ha sido creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subcategoria'
 *       400:
 *         description: Petición inválida (el body no es correcto)
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const subcategoriaService: SubcategoriaService = req.scope.resolve("subcategoriaService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const subcategoriaData = req.body as Subcategoria;
    const subcategoria = await subcategoriaService.crear(subcategoriaData);

    res.status(201).json({
      subcategoria,
    });
  }

  export const AUTHENTICATE = false