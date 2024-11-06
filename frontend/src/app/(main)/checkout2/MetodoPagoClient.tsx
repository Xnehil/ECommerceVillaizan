"use client";

import { useState, useEffect } from "react";
import CustomRectangle from "components/CustomRectangle";
import PaymentPopup from "components/PaymentPopup";
import ResumenCompra from "components/ResumenCompra";
import BackButton from "components/BackButton";
import { Pedido } from "types/PaquetePedido";
import { Usuario } from "types/PaqueteUsuario";
import { Direccion } from "types/PaqueteEnvio";
import axios from "axios";

type MetodoPagoClientProps = {
  pedidoInput: Pedido;
  setStep: (step: string) => void;
};

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const fetchPedido = async (pedido: Pedido) => {
  try {
    const response = await axios.get(`${baseUrl}/admin/pedido/${pedido.id}?enriquecido=true`);
    // console.log("Fetched pedido:", response.data.pedido);
    return response.data.pedido;
  } catch (error) {
    console.error("Error fetching pedido:", error);
    return null; // Return null or handle the error appropriately
  }
};

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
};

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
};

export default function MetodoPagoClient({ pedidoInput, setStep }: MetodoPagoClientProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [pedido, setPedido] = useState<Pedido | null>(null); // State to hold the fetched pedido
  
  const hayDescuento = true;
  const costoEnvio = 5;
  const noCostoEnvio = true;

  const calcularDescuento = () => {
    if (!pedidoInput) {
      return 0;
    }
    return pedidoInput.detalles.reduce((acc: number, item) => {
      if (item.promocion) {
        const originalPrice = Number(item.producto.precioEcommerce)
        const discountedPrice = Number(item.subtotal) / item.cantidad
        const discountPerItem = originalPrice - discountedPrice
        return acc + (discountPerItem * item.cantidad)
      }
      return acc
    }, 0)
  };

  let descuento : number = calcularDescuento();

  useEffect(() => {
    const getPedido = async () => {
      const fetchedPedido = await fetchPedido(pedidoInput);
      setPedido(fetchedPedido);
    };

    getPedido();
  }, [pedidoInput]); // Fetch pedido whenever pedidoInput changes

  const handleImageClick = (id: string | null) => {
    if (id === "pagoEfec") {
      setShowPopup(true);
      setSelectedImageId(id);
    } else {
      setSelectedImageId(id);
    }
  };

  const handlePaymentConfirm = (amount: number) => {
    setPaymentAmount(amount);
    setShowPopup(false);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedImageId(null);
    setPaymentAmount(null);
  };

  const handleBackClick = () => {
    setStep("direccion");
  };

  

  const calcularTotal = () => {
    const subtotal = calcularSubtotalSinDescuentos();
    const totalDescuento = hayDescuento ? descuento : 0;
    const totalEnvio = noCostoEnvio ? 0 : costoEnvio;

    let retorno = subtotal - totalDescuento + totalEnvio;

    // Si el total tiene más de un decimal, redondear a un decimal
    if (retorno * 10 % 1 !== 0) {
        const retornoRedondeado = Math.floor(retorno * 10) / 10;
        const parteDescontada = retorno - retornoRedondeado;

        retorno = retornoRedondeado;

        // Aumenta el descuento con la parte descontada, si es relevante para la lógica
        descuento += parteDescontada;
    }

    return retorno;
};



const calcularSubtotalSinDescuentos = () => {
  if (!pedidoInput) {
    return 0;
  }
  return pedidoInput.detalles.reduce((acc: number, item) => {
    const itemSubtotal = item.promocion
      ? Number(item.producto.precioEcommerce) * item.cantidad
      : Number(item.subtotal)
    
    return acc + itemSubtotal || 0
  }, 0);
};

  const calcularSubtotal = () => {
    if (!pedidoInput) {
      return 0;
    }
    return pedidoInput.detalles.reduce((acc: number, item) => {
      return acc + Number(item.subtotal) || 0;
    }, 0);
  };

  const calcularVuelto = () => {
    return paymentAmount ? paymentAmount - calcularTotal() : 0;
  };

  const total = calcularTotal();
  const vuelto = calcularVuelto();

  return (
    <>
      {/* Banner debajo del header */}
      <img
        src="/images/bannerFlujoCompra.png"
        alt="Promociones en Villaizan"
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px", paddingLeft: "60px" }}>
        <BackButton onClick={handleBackClick} />
      </div>

      <h1 style={{ marginTop: "20px", fontSize: "24px", fontWeight: "bold", paddingLeft: "80px" }}>Método Pago</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          paddingLeft: "100px",
          paddingRight: "40px",
        }}
      >
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
          width="45%"
          height="100px"
          onImageClick={handleImageClick}
          selectedImageId={selectedImageId}
          setPaymentAmount={setPaymentAmount}
          hideCircle={true}
        />

        {pedido && (
          <div style={{ marginRight: "180px", marginTop: "-20px", marginBottom: "40px" }}>
            <ResumenCompra
              descuento={descuento}
              costoEnvio={costoEnvio}
              noCostoEnvio={noCostoEnvio}
              hayDescuento={hayDescuento}
              paymentAmount={selectedImageId === "pagoEfec" && paymentAmount ? paymentAmount : null}
              selectedImageId={selectedImageId}
              total={total}
              vuelto={vuelto}
              direccion={pedido?.direccion ?? defaultDireccion}
              usuario={pedido?.usuario ?? defaultUsuario}
              pedido={pedidoInput}
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
  );
}
