import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import OrdenSerieService from "../../../services/OrdenSerie";
import { OrdenSerie } from "src/models/OrdenSerie";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ordenSerieService: OrdenSerieService = req.scope.resolve("ordenserieService");

    res.json({
        ordenSeries: await ordenSerieService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ordenSerieService: OrdenSerieService = req.scope.resolve("ordenserieService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const ordenSerieData = req.body as OrdenSerie;
    const ordenSerie = await ordenSerieService.crear(ordenSerieData);

    res.json({
        ordenSerie,
    });
};

export const AUTHENTICATE = false;
