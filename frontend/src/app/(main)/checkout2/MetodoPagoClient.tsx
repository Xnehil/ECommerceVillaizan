"use client"

import { useState, useEffect } from "react"
import CustomRectangle from "components/CustomRectangle"
import PaymentPopup from "components/PaymentPopup"
import ResumenCompra from "components/ResumenCompra"
import BackButton from "components/BackButton"
import { Pedido, MetodoPago, PedidoXMetodoPago } from "types/PaquetePedido"
import { Usuario } from "types/PaqueteUsuario"
import { Direccion } from "types/PaqueteEnvio"
import axios from "axios"
import PagosParciales from "@components/PagosParciales"

type MetodoPagoClientProps = {
  pedidoInput: Pedido
  setStep: (step: string) => void
}

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

const fetchPedido = async (pedido: Pedido) => {
  try {
    const response = await axios.get(
      `${baseUrl}/admin/pedido/${pedido.id}?enriquecido=true`
    )
    // console.log("Fetched pedido:", response.data.pedido);
    return response.data.pedido
  } catch (error) {
    console.error("Error fetching pedido:", error)
    return null // Return null or handle the error appropriately
  }
}

const defaultUsuario: Usuario = {
  nombre: "Juanito",
  apellido: "Perez",
  conCuenta: true,
  correo: "",
  contrasena: "",
  persona: undefined,
  id: "",
  desactivadoEn: null,
  usuarioCreacion: "",
  usuarioActualizacion: "",
  estaActivo: false,
}

const defaultDireccion: Direccion = {
  id: "",
  calle: "Av. Siempre Viva",
  numeroExterior: "742",
  distrito: "Springfield",
  codigoPostal: "12345",
  ciudad: undefined,
  ubicacion: undefined,
  envios: [],
  desactivadoEn: null,
  usuarioCreacion: "",
  usuarioActualizacion: "",
  estaActivo: false,
}

export default function MetodoPagoClient({
  pedidoInput,
  setStep,
}: MetodoPagoClientProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null)
  const [pedido, setPedido] = useState<Pedido | null>(null) // State to hold the fetched pedido
  const [dividido, setDividido] = useState(false)
  const [metodosPago, setMetodosPago] = useState<PedidoXMetodoPago[]>([])

  const hayDescuento = true
  const costoEnvio = 5
  const noCostoEnvio = true

  const calcularDescuento = () => {
    if (!pedidoInput) {
      return 0
    }
    return pedidoInput.detalles.reduce((acc: number, item) => {
      if (item.promocion) {
        const originalPrice = Number(item.producto.precioEcommerce)
        const discountedPrice = Number(item.subtotal) / item.cantidad
        const discountPerItem = originalPrice - discountedPrice
        return acc + discountPerItem * item.cantidad
      }
      return acc
    }, 0)
  }

  let descuento: number = calcularDescuento()

  useEffect(() => {
    const getPedido = async () => {
      const fetchedPedido = await fetchPedido(pedidoInput)
      setPedido(fetchedPedido)
    }

    getPedido()
  }, [pedidoInput]) // Fetch pedido whenever pedidoInput changes

  const handleImageClick = async (id: string | null) => {
    setSelectedImageId(id)

    if (pedido && pedido.id) {
      try {
        // Configura el cuerpo de la solicitud con la estructura específica
        const metodo = {
          id:
            id === "yape"
              ? "mp_01JBDQD78HBD6A0V1DVMEQAFKV"
              : id === "plin"
              ? "mp_01JBDQDH47XDE75XCGSS739E6G"
              : "mp_01J99CS1H128G2P7486ZB5YACH",
        } as MetodoPago;

        const pedidoUpdateData = {
          pedidosXMetodoPago: [
            {
              monto: calcularTotal(),
              pedido: pedido.id,
              metodoPago: metodo,
            },
          ],
        }

        await axios.put(
          `${baseUrl}/admin/pedido/${pedido.id}?enriquecido=true`,
          pedidoUpdateData,
          {
            headers: { "Content-Type": "application/json" },
          }
        )

        console.log(
          "Pedido actualizado con método de pago:",
          pedidoUpdateData.pedidosXMetodoPago
        )
      } catch (error) {
        console.error("Error al actualizar el método de pago:", error)
      }
    } else {
      console.error("No se encontró el ID del pedido.")
    }

    if (id === "pagoEfec") {
      setShowPopup(true)
    }
  }

  const handlePaymentConfirm = (amount: number) => {
    setPaymentAmount(amount)
    setShowPopup(false)
  }

  const handlePopupClose = () => {
    setShowPopup(false)
    setSelectedImageId(null)
    setPaymentAmount(null)
  }

  const handleBackClick = () => {
    setStep("direccion")
  }

  const calcularTotal = () => {
    const subtotal = calcularSubtotalSinDescuentos()
    const totalDescuento = hayDescuento ? descuento : 0
    const totalEnvio = noCostoEnvio ? 0 : costoEnvio

    let retorno = subtotal - totalDescuento + totalEnvio

    // Si el total tiene más de un decimal, redondear a un decimal
    if ((retorno * 10) % 1 !== 0) {
      const retornoRedondeado = Math.floor(retorno * 10) / 10
      const parteDescontada = retorno - retornoRedondeado

      retorno = retornoRedondeado

      // Aumenta el descuento con la parte descontada, si es relevante para la lógica
      descuento += parteDescontada
    }

    return retorno
  }

  const calcularSubtotalSinDescuentos = () => {
    if (!pedidoInput) {
      return 0
    }
    return pedidoInput.detalles.reduce((acc: number, item) => {
      const itemSubtotal = item.promocion
        ? Number(item.producto.precioEcommerce) * item.cantidad
        : Number(item.subtotal)

      return acc + itemSubtotal || 0
    }, 0)
  }



  const calcularSubtotal = () => {
    if (!pedidoInput) {
      return 0
    }
    return pedidoInput.detalles.reduce((acc: number, item) => {
      return acc + Number(item.subtotal) || 0
    }, 0)
  }

  const calcularVuelto = () => {
    return paymentAmount ? paymentAmount - calcularTotal() : 0
  }

  const total = calcularTotal()
  const vuelto = calcularVuelto()
  const totalPuntosCanje = (pedido?.detalles ?? []).reduce((totalPuntos, detalle) => {
    const puntos = ((detalle.producto?.cantidadPuntos ?? 0) * detalle.cantidad) || 0;
    return totalPuntos + puntos;
  }, 0);

  return (
    <>
      {/* Banner debajo del header */}
      <img
        src="/images/bannerFlujoCompra.png"
        alt="Promociones en Villaizan"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
          paddingLeft: "60px",
        }}
      >
        <BackButton onClick={handleBackClick} />
      </div>

      <h1
        style={{
          marginTop: "20px",
          fontSize: "24px",
          fontWeight: "bold",
          paddingLeft: "80px",
        }}
      >
        Método Pago
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          paddingLeft: "100px",
          paddingRight: "40px",
        }}
      >
        <div style={{ display: "flex", width: "100%", flexDirection: "column", gap: "20px" }}>
          <CustomRectangle
            text="Pago Contraentrega"
            images={[
              {
                id: "pagoEfec",
                src: "/images/efectivo.png",
                hoverText: "Pago en Efectivo",
              },
              {
                id: "yape",
                src: "/images/yape.png", // Usamos la misma imagen para Yape
                hoverText: "Pago con Yape",
              },
              {
                id: "plin",
                src: "/images/plin.png", // Usamos la misma imagen para Plin
                hoverText: "Pago con Plin",
              },
            ]}
            width="85%"
            height="100px"
            onImageClick={handleImageClick}
            selectedImageId={selectedImageId}
            setPaymentAmount={setPaymentAmount}
            hideCircle={true}
          />

          <PagosParciales
            text="Pago Dividido"
            images={[
              {
                id: "pagoEfec",
                src: "/images/efectivo.png",
                hoverText: "Pago en Efectivo",
              },
              {
                id: "yape",
                src: "/images/yape.png", // Usamos la misma imagen para Yape
                hoverText: "Pago con Yape",
              },
              {
                id: "plin",
                src: "/images/plin.png", // Usamos la misma imagen para Plin
                hoverText: "Pago con Plin",
              },
            ]}
            width="85%"
            height="100px"
            onImageClick={handleImageClick}
            setMetodosPago={setMetodosPago}
            setPaymentAmount={setPaymentAmount}
            hideCircle={true}
          />
        </div>

        {pedido && (
          <div
            style={{
              marginRight: "180px",
              marginTop: "-20px",
              marginBottom: "40px",
            }}
          >
            <ResumenCompra
              descuento={descuento}
              costoEnvio={costoEnvio}
              noCostoEnvio={noCostoEnvio}
              hayDescuento={hayDescuento}
              paymentAmount={
                selectedImageId === "pagoEfec" && paymentAmount
                  ? paymentAmount
                  : null
              }
              selectedImageId={selectedImageId}
              total={total}
              vuelto={vuelto}
              direccion={pedido?.direccion ?? defaultDireccion}
              usuario={pedido?.usuario ?? defaultUsuario}
              pedido={pedidoInput}
              canjePuntos = {totalPuntosCanje}
            />
          </div>
        )}
      </div>

      {showPopup && (
        <PaymentPopup
          totalPagar={total}
          onConfirm={handlePaymentConfirm}
          onClose={handlePopupClose}
          montoMaximoDeVuelto={100}
        />
      )}
    </>
  )
}
