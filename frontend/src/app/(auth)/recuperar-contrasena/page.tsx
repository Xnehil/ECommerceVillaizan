"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@components/Button";
import { Separator } from "@components/Separator";
import ErrorMessage from "../_components/ErrorMessage";
import InputWithLabel from "../_components/InputWithLabel";
import SuccessMessage from "../_components/SuccessMessage";
import Link from "next/link";
import LogoBackHome from "../_components/LogoBackHome";

function PasswordChangePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <LogoBackHome/>
      <p className="text-muted-foreground mt-3 text-sm">
        Ingresa el correo relacionado para recuperar la contraseña
      </p>
      <Separator orientation="horizontal" className="mt-7 w-[460px]" />
      <div className="mt-5 flex w-[400px] flex-col gap-3">
        <InputWithLabel label="Correo electrónico" type="text" placeholder="Ej. alb_marq@gmail.com" />

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <Button isLoading={isLoading} disabled={isLoading}>
          Confirmar
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
export default PasswordChangePage;
