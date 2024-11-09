import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import UsuarioService from "../../../../services/Usuario";
import { Usuario } from "../../../../models/Usuario";
/**
 * @swagger
 * /usuario/loginGoogle:
 *   post:
 *     summary: Login or register a user using Google credentials
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               nombre:
 *                 type: string
 *                 description: User's first name
 *               apellido:
 *                 type: string
 *                 description: User's last name
 *               imagenperfil:
 *                 type: string
 *                 description: URL of the user's profile image
 *     responses:
 *       200:
 *         description: Successfully logged in or registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuario no encontrado
 */
interface LoginGoogleRequestBody {
    email: string;
    nombre: string;
    apellido: string;
    imagenperfil: string;
}

export const POST = async (
    req: MedusaRequest & { body: LoginGoogleRequestBody },
    res: MedusaResponse
) => {
    const usuarioService: UsuarioService = req.scope.resolve("usuarioService");
    const { email, nombre, apellido, imagenperfil } = req.body;
    const newUsuario: Usuario = new Usuario();
    newUsuario.correo = email;
    newUsuario.nombre = nombre;
    newUsuario.apellido = apellido;
    newUsuario.imagenPerfil = imagenperfil;
    newUsuario.conCuenta = true;
    newUsuario.contrasena = 'google';

    try {
        const usuario = await usuarioService.crearUsuarioGoogle(newUsuario);
        res.json({ usuario});
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Usuario no encontrado" });
    }
};

export const AUTHENTICATE = false;