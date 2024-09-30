"use client"

import { useState } from "react"
import CartTemplate from "@modules/cart/templates"
import CustomRectangle from "components/CustomRectangle"
import PaymentPopup from "components/PaymentPopup"
import { CartWithCheckoutStep } from "types/global"

type CartClientProps = {
  cart: CartWithCheckoutStep | null
  customer: any
}

export default function CartClient({ cart, customer }: CartClientProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null)

  const handleImageClick = (id: string) => {
    if (id === "pagoEfec") {
      setShowPopup(true)
      setSelectedImageId(id)
    }
  }

  const handlePaymentConfirm = (amount: number) => {
    setPaymentAmount(amount)
    setShowPopup(false)
  }

  const handlePopupClose = () => {
    setShowPopup(false)
    setSelectedImageId(null)
  }

  return (
    <>
      <CartTemplate cart={cart} customer={customer} />
      <CustomRectangle 
        text="Contra Entrega" 
        images={[{ id: "pagoEfec", src: "/images/efectivo.png", hoverText: "Pago en Efectivo" }]} 
        width="50%" 
        height="100px" 
        onImageClick={handleImageClick}
        selectedImageId={selectedImageId} // Pasamos el id seleccionado
      />
      {showPopup && (
        <PaymentPopup 
          totalPagar={cart?.total || 100} 
          onConfirm={handlePaymentConfirm} 
          onClose={handlePopupClose} 
        />
      )}
    </>
  )
}