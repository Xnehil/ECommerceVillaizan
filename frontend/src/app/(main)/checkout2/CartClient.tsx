"use client";

import { useState } from "react";
import CartTemplate from "@modules/cart/templates";
import CustomRectangle from "components/CustomRectangle";
import PaymentPopup from "components/PaymentPopup";
import ResumenCompra from "components/ResumenCompra";
import { CartWithCheckoutStep } from "types/global";
import { ArrowLeft } from "react-feather"; // Add this for the arrow icon

type CartClientProps = {
  cart: CartWithCheckoutStep | null;
  customer: any;
};

export default function CartClient({ cart, customer }: CartClientProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);

  const handleImageClick = (id: string) => {
    if (id === "pagoEfec") {
      setShowPopup(true);
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
  };

  const productos = [
    { nombre: 'Producto 1', cantidad: 2, precio: 50 },
    { nombre: 'Producto 2', cantidad: 1, precio: 30 },
  ];

  return (
    <>
      {/* Mantener CartTemplate en la parte superior */}
      {/*<CartTemplate cart={cart} customer={customer} />*/}
  
      {/* "Volver" button with left arrow */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px", paddingLeft: "40px" }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "transparent",
            border: "none",
            color: "#0070f3", // Customize the color as needed
            cursor: "pointer",
          }}
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={16} style={{ marginRight: "8px" }} />
          Volver
        </button>
      </div>
  
      {/* Header for "Metodo Pago" */}
      <h1 style={{ marginTop: "20px", fontSize: "24px", fontWeight: "bold", paddingLeft: "40px" }}>Metodo Pago</h1>
  
      {/* Dividir CustomRectangle y ResumenCompra en la misma línea */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          paddingLeft: "40px", // Add padding for left spacing
          paddingRight: "40px", // Add padding for right spacing
        }}
      >
        {/* Lado izquierdo: CustomRectangle */}
        <CustomRectangle
          text="Contra Entrega"
          images={[
            {
              id: "pagoEfec",
              src: "/images/efectivo.png",
              hoverText: "Pago en Efectivo",
            },
          ]}
          width="45%" // Reduce width for more space
          height="100px"
          onImageClick={handleImageClick}
          selectedImageId={selectedImageId}
        />
  
        {/* Lado derecho: ResumenCompra con margen superior y margen derecho */}
        <div style={{ marginRight: "200px", marginTop: "-20px", marginBottom: "40px"}}> {/* Ajustar el marginTop para elevar ResumenCompra */}
          <ResumenCompra
            productos={productos}
            descuento={10}
            costoEnvio={5}
            textoCustomizado="Tu data personal será usada para mejorar tu experiencia en esta pagina, para otros propositos revisar el privacy policy."
            noCostoEnvio = {true}
          />
        </div>
      </div>
  
      {/* Popup de pago */}
      {showPopup && (
        <PaymentPopup
          totalPagar={cart?.total || 100}
          onConfirm={handlePaymentConfirm}
          onClose={handlePopupClose}
        />
      )}
    </>
  );
  
  
}
