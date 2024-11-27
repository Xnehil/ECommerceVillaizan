import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

import PedidoService from "../../../../services/Pedido";
import { Pedido } from "src/models/Pedido";
import PromocionService from "../../../../services/Promocion";
import PuntosProductoService from "@services/PuntosProducto";
import { PuntosProducto } from "@models/PuntosProducto";
import UsuarioService from "@services/Usuario";

/**
 * @swagger
 * /pedido/pagoConfirmado:
 *   post:
 *     summary: Confirma el pago de un pedido
 *     description: Procesa la confirmación de pago de un pedido, aplica promociones y acumula puntos para el usuario asociado al pedido.
 *     tags:
 *       - Pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: El identificador único del pedido.
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Pedido procesado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedido:
 *                   type: object
 *                   description: Información del pedido actualizado.
 *       400:
 *         description: La solicitud es inválida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Petición inválida"
 *       404:
 *         description: Pedido no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pedido no encontrado"
 *                 message:
 *                   type: string
 *                   description: Detalle del error.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error procesando la petición"
 *                 message:
 *                   type: string
 *                   description: Detalle del error.
 */

interface PedidoRequestBody {
    id: string;
}

export const POST = async (
    req: MedusaRequest & { body: PedidoRequestBody },
    res: MedusaResponse
) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");
    const promocionService: PromocionService = req.scope.resolve("promocionService");
    const puntosProductoService: PuntosProductoService = req.scope.resolve("puntosproductoService");
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }

    const { id } = req.body;

    try {
        const pedido: Pedido = await pedidoService.encontrarPorId(id);

        

        // En caso el usuario no tenga cuenta, no se le aplican puntos ni promociones
        if (!pedido.usuario.conCuenta) {
            console.log("Usuario sin cuenta, no se aplican puntos ni promociones");
            pedido.pagado = true;
            await pedidoService.actualizar(id, { pagado: true});
            res.json({ pedido });
            return;
        }

        let totalPuntos = 0;

        //console.log("Pedido encontrado");

        /*const updatePromocion = async (detalle) => {
            if (detalle.promocion && detalle.promocion.limiteStock !== null) {
                const promocion = await promocionService.recuperar(detalle.promocion.id);
                if (promocion.limiteStock > 0) {
                    console.log("Promoción con stock limitado", promocion);
                    console.log("Restando stock de promoción. Limite stock inicial", promocion.limiteStock);
                    promocion.limiteStock -= detalle.cantidad;
                    if (promocion.limiteStock < 0) {
                        promocion.limiteStock = 0;
                        promocion.esValido = false;
                    }
                    console.log("Limite stock final", promocion.limiteStock);
                    await promocionService.actualizar(detalle.promocion.id, promocion);
                }
            }
        };*/
        
        const updateProducto = async (detalle) => {
            if (detalle.producto) {
                const puntosProducto: PuntosProducto | null = await puntosProductoService.encontrarPuntosPorProductoActivo(
                    detalle.producto.id
                );
                if (puntosProducto && puntosProducto.cantidadPuntos && puntosProducto.cantidadPuntos > 0) {
                    console.log("Acumulando puntos por producto", puntosProducto);
                    totalPuntos += puntosProducto.cantidadPuntos * detalle.cantidad;
                }
            }
        };
        
        const updatePromises = pedido.detalles.map(async (detalle) => {
            //await updatePromocion(detalle);
            await updateProducto(detalle);
        });

        await Promise.all(updatePromises);

        if (totalPuntos > 0) {
            console.log("Acumulando puntos al usuario", pedido.usuario);
            if (pedido.usuario.puntosAcumulados == null) {
                pedido.usuario.puntosAcumulados = 0;
            }
        
            pedido.usuario.puntosAcumulados += totalPuntos;
        
            await usuarioService.actualizar(pedido.usuario.id, pedido.usuario);
        }
        pedido.puntosOtorgados = totalPuntos;
        pedido.pagado = true;
        await pedidoService.actualizar(id, { puntosOtorgados: totalPuntos, pagado: true });

        const pedidoReturn: Pedido = await pedidoService.encontrarPorId(id);
        res.json({ pedido:pedidoReturn });
    } catch (error) {
        res.status(500).json({ error: "Error procesando la petición", message: error.message });
    }
};

export const AUTHENTICATE = false;
