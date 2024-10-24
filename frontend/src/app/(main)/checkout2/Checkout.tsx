"use client"

import React, { use, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import { Pedido } from "types/PaquetePedido"
import MetodoPagoClient from "./MetodoPagoClient"
import StepDireccion from "./StepDireccion"
import { LoadScript } from "@react-google-maps/api"

// Example components for different steps
const StepConfirmacion = () => <div>Step Confirmación</div>

interface CheckoutProps {
  pedido: Pedido
  /*usuario?: any;
    direccion?: any;*/
}

const Checkout: React.FC<CheckoutProps> = ({
  pedido /*, usuario, direccion*/,
}) => {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(searchParams.get("step") || "aaa")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded) {
      setLoaded(true)
    }
  }),
    [loaded]

  const renderStep = () => {
    switch (step) {
      case "direccion":
        return <StepDireccion setStep={setStep} />
      case "pago":
        return <MetodoPagoClient pedidoInput={pedido} setStep={setStep} />
      default:
        return <div>Seleccione un paso válido</div>
    }
  }

  return (
    <div>
      {window.google === undefined ? (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          libraries={["places"]}
        >
          {renderStep()}
        </LoadScript>
      ) : (
        renderStep()
      )}
    </div>
  )
}

export default Checkout
