import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  AuthService  from "../../../services/Auth"


export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const authService: AuthService = req.scope.resolve("authService");
    const bodyData = req.body as { email: string, password: string };
    if (!bodyData || typeof bodyData.email !== 'string' || typeof bodyData.password !== 'string') {
      res.status(400).json({ error: "Petición inválida, el email y password deben ser un string" });
      return;
    }
  
    const { email, password } = bodyData;
  
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