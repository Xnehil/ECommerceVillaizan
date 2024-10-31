import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  NotificacionService  from "@services/Notificacion"
import { Notificacion } from "src/models/Notificacion";

/**
 * @swagger
 * tags:
 *  name: Notificacion
 * description: API para notificacions
 * 
  */

/**
 * @swagger
 * /notificacion:
 *   get:
 *     summary: Lista todas las notificacions con paginación
 *     tags: [Notificacions]
 *     parameters:
 *       - in: query
 *         name: rol
 *         schema:
 *           type: string
 *         required: false
 *         description: El rol del usuario (e.g., Admin, Motorizado)
 *       - in: query
 *         name: id_usuario
 *         schema:
 *           type: string
 *         required: false
 *         description: El ID del usuario
 *     responses:
 *       200:
 *         description: Una lista de notificacions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificacions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notificacion'
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const notificacionService: NotificacionService = req.scope.resolve("notificacionService");

  // Extract the role from the query parameters
  const { rol, id_usuario } = req.query as { rol: string, id_usuario: string };

  let notificaciones;
  console.log(rol, id_usuario);
  if (id_usuario) {
    notificaciones = await notificacionService.listarPorUsuario(id_usuario);
  } else if (rol === "Admin" || rol === "Motorizado") {
    // Filter notifications for admin role
    notificaciones = await notificacionService.listarConPaginacion({
      sistema: `ecommerce${rol}`
    });
  } else {
    // Return all notifications if no role or different role is specified
    notificaciones = await notificacionService.listarConPaginacion();
  }

  res.json({
    notificaciones,
  });
};

  /**
 * @swagger
 * /notificacion:
 *   post:
 *     summary: Crea una nueva notificacion
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notificacion'
 *     responses:
 *       201:
 *         description: La notificacion ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const notificacionService: NotificacionService = req.scope.resolve("notificacionService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const notificacionData = req.body as Notificacion;
    const notificacion = await notificacionService.crear(notificacionData);

    res.status(201).json({
      notificacion,
    });
  }

  export const AUTHENTICATE = false