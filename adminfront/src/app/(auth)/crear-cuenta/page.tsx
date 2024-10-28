"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "../_components/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ErrorMessage from "../_components/ErrorMessage";
import SuccessMessage from "../_components/SuccessMessage";
import InputWithLabel from "../_components/InputWithLabel";
import LogoBackHome from "../_components/LogoBackHome";

function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const allFieldsAreFilled = name && lastname && email && password && confirmedPassword;

  const handleRegister = async () => {
    setIsLoading(true);

    if (password !== confirmedPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/usuario?revisar=true`, {
        nombre: name,
        apellido: lastname,
        concuenta: true,
        numerotelefono: "",
        correo: email,
        contrasena: password,
      });

      setSuccess(response.data.message);
      setIsLoading(false);

      router.push("/login");
    } catch (error) {
      setError("Ups! Algo salió mal.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <LogoBackHome/>
      <p className="text-muted-foreground mt-3 text-sm">
        Ingresa tus datos para registrarte en la plataforma
      </p>
      <Separator orientation="horizontal" className="mt-7 w-[460px]" />
      <div className="mt-5 flex w-[400px] flex-col gap-3">
        <InputWithLabel
          label="Nombre"
          type="text"
          placeholder="Ej. Alberto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputWithLabel
          label="Apellido"
          type="text"
          placeholder="Ej. Marquez"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <InputWithLabel
          label="Correo electrónico"
          type="email"
          placeholder="Ej. alb_marq@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputWithLabel
          label="Contraseña"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputWithLabel
          label="Confirmar contraseña"
          type="password"
          placeholder="Contraseña"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <Button isLoading={isLoading} disabled={isLoading || !allFieldsAreFilled} onClick={handleRegister}>
          Registrarse
        </Button>
        <section className="flex flex-row items-center justify-center">
          <Link className={buttonVariants({ variant: "link" })} href={"/login"}>
            ¿Ya tienes una cuenta?
          </Link>
        </section>
      </div>
    </div>
  );
}



export default RegisterPage;
