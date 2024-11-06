"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Pedido } from "types/PaquetePedido"
import MetodoPagoClient from "./MetodoPagoClient"
import StepDireccion from "./StepDireccion"
import { LoadScript } from "@react-google-maps/api"

const StepConfirmacion = () => <div>Step Confirmación</div>

interface CheckoutProps {
  pedido: Pedido
}

const Checkout: React.FC<CheckoutProps> = ({ pedido }) => {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(searchParams.get("step") || "aaa")
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const renderStep = () => {
    switch (step) {
      case "direccion":
        return (
          <StepDireccion
            setStep={setStep}
            googleMapsLoaded={googleMapsLoaded}
          />
        )
      case "pago":
        return <MetodoPagoClient pedidoInput={pedido} setStep={setStep} />
      default:
        return <div>Seleccione un paso válido</div>
    }
  }

  return <div>{renderStep()}</div>
}

export default Checkout
