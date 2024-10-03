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
  usuario: Usuario;
  direccion: Direccion;
};

export default function MetodoPagoClient({ pedido, usuario, direccion}: MetodoPagoClientProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [vuelto, setVuelto] = useState<number>(0);

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
    window.history.back();
  };

  return (
    <>
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
        />

        <div style={{ marginRight: "180px", marginTop: "-20px", marginBottom: "40px" }}>
          <ResumenCompra
            descuento={10}
            costoEnvio={5}
            noCostoEnvio={true}
            paymentAmount={selectedImageId === "pagoEfec" && paymentAmount ? paymentAmount : null}
            selectedImageId={selectedImageId}
            onTotalChange={setTotal}
            onVueltoChange={setVuelto}
            detalles = {pedido.detalles}
            direccion={direccion}
            usuario={usuario}
          />
        </div>
      </div>

      {showPopup && (
        <PaymentPopup
          totalPagar={total}
          onConfirm={handlePaymentConfirm}
          onClose={handlePopupClose}
        />
      )}
    </>
  );
}