import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import MetodoPagoService from "../../../services/MetodoPago";
import { MetodoPago } from "src/models/MetodoPago";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");

    res.json({
        metodoPagos: await metodoPagoService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const metodoPagoData = req.body as MetodoPago;
    const metodoPago = await metodoPagoService.crear(metodoPagoData);

    res.json({
        metodoPago,
    });
};

export const AUTHENTICATE = false;
