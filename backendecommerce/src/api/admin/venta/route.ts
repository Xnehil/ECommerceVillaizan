import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import VentaService from "../../../services/Venta";
import { Venta } from "src/models/Venta";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ventaService: VentaService = req.scope.resolve("ventaService");

    res.json({
        ventas: await ventaService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ventaService: VentaService = req.scope.resolve("ventaService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const ventaData = req.body as Venta;
    const venta = await ventaService.crear(ventaData);

    res.json({
        venta,
    });
};

export const AUTHENTICATE = false;
