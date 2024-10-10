"use client";

import { useState } from "react";
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

const fetchPedido = async (pedido : Pedido) => {
  try{
    const response = await axios.get(`${baseUrl}/admin/pedido/${pedido.id}?enriquecido=true`);
    const pedidoRespuesta :Pedido= response.data.pedido;
    console.log("Pedido recuperado")
    return pedidoRespuesta
  }
  catch(error){
    console.log(error)
  }
}

const defaultUsuario : Usuario = {
  nombre: "Juan",
  apellido: "Perez",
  conCuenta: true,
  correo: "",
  contrasena: "",
  persona: undefined,
  id: "",
  desactivadoEn: null,
  usuarioCreacion: "",
  usuarioActualizacion: "",
  estaActivo: false
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
  estaActivo: false
};

export default async function MetodoPagoClient({ pedidoInput, setStep}: MetodoPagoClientProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const descuento = 10;
  const hayDescuento = false;
  const costoEnvio = 5;
  const noCostoEnvio = true;

  const pedido = await fetchPedido(pedidoInput);
  

  const handleImageClick = (id: string | null) => {
    if (id === "pagoEfec") {
      setShowPopup(true);
      setSelectedImageId(id);
    } else {
      setSelectedImageId(null);
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
    //window.history.back();
    setStep("direccion")
  };

  const calcularTotal = () => {
    return calcularSubtotal() - (hayDescuento? descuento: 0) + (noCostoEnvio ? 0 : costoEnvio);
  };

  const calcularSubtotal = () => {
    if (!pedido) {
      return 0;
    }
    return pedido.detalles.reduce((acc: number, item) => {
      return acc + Number(item.subtotal) || 0;
    }, 0);
  };

  const calcularVuelto = () => {
    return paymentAmount ? paymentAmount - calcularTotal() : 0;
  }

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
          text="Contra Entrega"
          images={[
            {
              id: "pagoEfec",
              src: "/images/efectivo.png",
              hoverText: "Pago en Efectivo",
            },
          ]}
          width="45%"
          height="100px"
          onImageClick={handleImageClick}
          selectedImageId={selectedImageId}
          setPaymentAmount={setPaymentAmount}
          hideCircle = {true}
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
              direccion={pedido?.direccion ?? defaultDireccion} // Provide a default Direccion
              usuario={pedido?.usuario ?? defaultUsuario}
              pedido={pedido}
            />
          </div>
        )}
      </div>

      {showPopup && (
        <PaymentPopup
          totalPagar={total}
          onConfirm={handlePaymentConfirm}
          onClose={handlePopupClose}
          montoMaximoDeVuelto = {100}
        />
      )}
    </>
  );
}