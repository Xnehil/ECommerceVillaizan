import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PedidoService from "../../../services/Pedido";
import { Pedido } from "src/models/Pedido";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");

    res.json({
        pedidos: await pedidoService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const pedidoData = req.body as Pedido;
    const pedido = await pedidoService.crear(pedidoData);

    res.json({
        pedido,
    });
};

export const AUTHENTICATE = false;
