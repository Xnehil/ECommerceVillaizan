import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"

import  AuthService  from "../../../services/Auth"

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
      return res.status(400).json({error: response.message});
    }
    return res.status(201).json({
      response
    });
  } catch (error) {
    return res.status(405).json({ error: error.message });
  }
}

export const AUTHENTICATE = false