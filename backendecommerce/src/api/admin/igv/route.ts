import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import IgvService from "../../../services/Igv";
import { Igv } from "src/models/Igv";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const igvService: IgvService = req.scope.resolve("igvService");

    res.json({
        igvs: await igvService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const igvService: IgvService = req.scope.resolve("igvService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const igvData = req.body as Igv;
    const igv = await igvService.crear(igvData);

    res.json({
        igv,
    });
};

export const AUTHENTICATE = false;
