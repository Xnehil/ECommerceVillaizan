import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import BancoService from "../../../services/Banco";
import { Banco } from "src/models/Banco";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const bancoService: BancoService = req.scope.resolve("bancoService");

    res.json({
        bancos: await bancoService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const bancoService: BancoService = req.scope.resolve("bancoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const bancoData = req.body as Banco;
    const banco = await bancoService.crear(bancoData);

    res.json({
        banco,
    });
};

export const AUTHENTICATE = false;
