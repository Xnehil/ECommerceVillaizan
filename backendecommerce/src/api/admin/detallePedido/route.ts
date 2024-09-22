import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import DetallePedidoService from "../../../services/DetallePedido";
import { DetallePedido } from "src/models/DetallePedido";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const detallePedidoService: DetallePedidoService = req.scope.resolve("detallepedidoService");

    res.json({
        detallePedidos: await detallePedidoService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const detallePedidoService: DetallePedidoService = req.scope.resolve("detallepedidoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const detallePedidoData = req.body as DetallePedido;
    const detallePedido = await detallePedidoService.crear(detallePedidoData);

    res.json({
        detallePedido,
    });
};

export const AUTHENTICATE = false;
