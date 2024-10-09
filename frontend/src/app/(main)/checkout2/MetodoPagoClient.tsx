"use client";

import { useState } from "react";
import CustomRectangle from "components/CustomRectangle";
import PaymentPopup from "components/PaymentPopup";
import ResumenCompra from "components/ResumenCompra";
import BackButton from "components/BackButton";
import { Pedido } from "types/PaquetePedido";
import { Usuario } from "types/PaqueteUsuario";
import { Direccion } from "types/PaqueteEnvio";

type MetodoPagoClientProps = {
  pedido: Pedido;
  setStep: (step: string) => void;
};

export default function MetodoPagoClient({ pedido, setStep}: MetodoPagoClientProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const descuento = 10;
  const hayDescuento = false;
  const costoEnvio = 5;
  const noCostoEnvio = true;

  const usuario : Usuario = {
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

  const direccion: Direccion = {
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
    return pedido.detalles.reduce((acc:number , item) => {
      return acc + Number(item.subtotal) || 0
    } , 0)
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
            direccion={direccion}
            usuario={usuario}
            pedido={pedido}
          />
        </div>
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