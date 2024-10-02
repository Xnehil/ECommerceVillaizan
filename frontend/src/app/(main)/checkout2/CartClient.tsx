"use client";

import { useState } from "react";
import CartTemplate from "@modules/cart/templates";
import CustomRectangle from "components/CustomRectangle";
import PaymentPopup from "components/PaymentPopup";
import ResumenCompra from "components/ResumenCompra"; // Asegúrate de importar el componente ResumenCompra
import { CartWithCheckoutStep } from "types/global";

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
      <CartTemplate cart={cart} customer={customer} />

      {/* Dividir CustomRectangle y ResumenCompra en la misma línea */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
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
          width="50%"
          height="100px"
          onImageClick={handleImageClick}
          selectedImageId={selectedImageId}
        />

        {/* Lado derecho: ResumenCompra */}
        <ResumenCompra
          productos={productos}
          descuento={10}
          costoEnvio={5}
          textoCustomizado="Gracias por su compra."
        />
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
