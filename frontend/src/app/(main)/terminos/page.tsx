import { CartWithCheckoutStep } from "types/global"
import Divider from "@modules/common/components/divider"
import { Customer } from "@medusajs/medusa"

const TerminoTemplate = ({
}: {
}) => {
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        <h1>Términos y Condiciones</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>
    </div>
  )
}

export default TerminoTemplate