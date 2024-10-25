import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Banco } from "../models/Banco";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import UsuarioRepository from "src/repositories/Usuario";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

class AuthPayLoad{

    email: string;

    password: string;
}

class AuthService extends TransactionBaseService {
    protected usuarioRepository_: typeof UsuarioRepository;
    protected jwtService: JwtService;

    constructor(container) {
        super(container);
        this.usuarioRepository_ = container.usuarioRepository;
        this.jwtService = container.jwtService;
    }

    getMessage() {
        return "Hello from BancoService";
    }

    async login(email : string, password :string) {
        const usuarioRepo = this.activeManager_.withRepository(this.usuarioRepository_);
        const user = await usuarioRepo.findByEmail(email);
    
        if (!user) {
          return {
            status: 'Error',
            message: 'Usuario no encontrado',
            result: [],
          };
        }

        const validatePassword = await bcrypt.compare(password, user.contrasena);
        console.log("passed validated  psswd")
    
        if (!validatePassword) {
          return {
            status: 'Error',
            message: 'Contraseña incorrecta',
            result: [],
          };
        }
    
        const payload = { id: user.id, email: user.correo };
        console.log("in payload")
        console.log("payload",payload)
        const token = this.jwtService.sign(payload);
        console.log("token generated")
    
        return {
          status: 'Success',
          message: 'Usuario correctamente autenticado',
          token: token,
          user,
        };
      }
}

export default AuthService;
