"use client"

import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import { CartWithCheckoutStep } from "types/global"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { Customer } from "@medusajs/medusa"
import { Pedido } from "types/PaquetePedido"
import { useEffect, useRef, useState } from "react"
import BackButton from "@components/BackButton"
import { useSession } from "next-auth/react"


const CartTemplate = ({
  cart,
  customer,
}: {
  cart: Pedido 
  customer?: Omit<Customer, "password_hash"> | null
}) => {
  const [carritoState, setCarritoState] = useState<Pedido>(cart)
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasRunOnce = useRef(false);
  
  const handleBackClick = () => {
    //Enviar a /comprar
    window.history.back()
  }

  useEffect(() => {
    if(status !== "loading" && !hasRunOnce.current) {
      hasRunOnce.current = true;
      if (session?.user?.id) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [session, status]);

  return (
    
    <div className="py-6">
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px", paddingLeft: "60px" }}>
          <BackButton onClick={handleBackClick} />
      </div>

      <div className="content-container" data-testid="cart-container">
        {cart?.detalles.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 gap-y-6">
              {/* {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )} */}
              <ItemsTemplate carrito={carritoState} setCarrito={setCarritoState} isAuthenticated={isAuthenticated} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart  && (
                  <>
                    <div className="bg-white py-6">
                      <Summary carrito={carritoState} isAuthenticated={isAuthenticated}/>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
