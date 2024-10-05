import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import { CartWithCheckoutStep } from "types/global"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { Customer } from "@medusajs/medusa"
import { Pedido } from "types/PaquetePedido"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: Pedido | null
  customer?: Omit<Customer, "password_hash"> | null
}) => {
  return (
    <div className="py-12">
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
              <ItemsTemplate items={cart?.detalles} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart  && (
                  <>
                    <div className="bg-white py-6">
                      {/* <Summary cart={cart} /> */}
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
