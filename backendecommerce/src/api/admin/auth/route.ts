import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  AuthService  from "../../../services/Auth"

/*
interface InventarioMotorizadoRequestBody {
    id_ciudad: string;
}
  
  export const POST = async (
    req: MedusaRequest & { body: InventarioMotorizadoRequestBody },
    res: MedusaResponse
  ) => {
    const inventarioMotorizadoService: InventarioMotorizadoService = req.scope.resolve("inventariomotorizadoService");
    const { id_ciudad } = req.body;
  
    try {
        const inventarios = await inventarioMotorizadoService.findByCiudadId(id_ciudad);
        res.json({ inventarios });
    } catch (error) {
        res.status(404).json({ error: "Inventario motorizado no encontrado" });
    }
  };
*/
interface AuthRequestBody {
    email: string;
    password: string;
}

export const POST = async (
    req: MedusaRequest & { body: AuthRequestBody },
    res: MedusaResponse
  ) => {
    const authService: AuthService = req.scope.resolve("authService");  
    const { email, password } = req.body;
  
    try {
      const response = await authService.login(email, password);
      if(response.status === 'Error'){
        res.status(400).json({error: response.message})
      }
      res.status(201).json({
        response
      });
    } catch (error) {
      res.status(405).json({ error: error.message });
    }
  }

  export const AUTHENTICATE = false