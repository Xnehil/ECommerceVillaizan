import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PagoService from "../../../services/Pago";
import { Pago } from "src/models/Pago";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pagoService: PagoService = req.scope.resolve("pagoService");

    res.json({
        pagos: await pagoService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pagoService: PagoService = req.scope.resolve("pagoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const pagoData = req.body as Pago;
    const pago = await pagoService.crear(pagoData);

    res.json({
        pago,
    });
};

export const AUTHENTICATE = false;
