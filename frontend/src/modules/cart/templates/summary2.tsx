import { Heading } from "@medusajs/ui";
import CartTotals from "@modules/common/components/cart-totals";
import Divider from "@modules/common/components/divider";
import { Pedido } from "types/PaquetePedido";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

type Summary2Props = {
  carrito: Pedido;
  handleSubmit: () => void;
  isFormValid: boolean;
  showWarnings: boolean;
  checkFormValidity: () => boolean;
  showErrorValidacion: boolean;
  mensajeErrorValidacion: string;
  href?: string; // Optional href prop
};

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;


const Summary2 = ({ carrito, handleSubmit, isFormValid, showWarnings,checkFormValidity,showErrorValidacion,mensajeErrorValidacion,href }: Summary2Props) => {
  const [minimo, setMinimo] = useState<number>(25); // Default value, will be updated after fetch
  const [costoEnvio, setCostoEnvio] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // For loading state
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //const hasRunOnceAuth = useRef(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [clickedWhenDisabled, setClickedWhenDisabled] = useState<boolean>(false); // Track click when disabled

  const subtotal = carrito.detalles.reduce((acc: number, item) => {
    return acc + Number(item.subtotal) || 0;
  }, 0);


  useEffect(() => {
    const isFormValidLocal = checkFormValidity();
    const isDisabledLocal = subtotal < minimo || !isFormValidLocal;
    setIsDisabled(isDisabledLocal);
  }
  , [isFormValid, subtotal, minimo]);

  useEffect(() => {
    if(status !== "loading" /*&& !hasRunOnceAuth.current*/) {
      //hasRunOnceAuth.current = true;
      if (session?.user?.id) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [session, status]);


  const [minOrderAmount, setMinOrderAmount] = useState<number>(25); // For the minimum order amount from the backend

 
  // Fetch the minimum order amount on component mount
  useEffect(() => {
    const fetchMinOrderAmount = async () => {
      try {
        const minOrderResponse = await axios.get(`${baseUrl}/admin/ajuste/monto_minimo_pedido`);
        const ajuste = minOrderResponse.data.ajuste;
        if (ajuste && ajuste.valor) {
          setMinimo(ajuste.valor);
        }
      } catch (error) {
        console.error("Error fetching minimum order amount", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMinOrderAmount();
  }, []);


  const handleClick = () => {
    //console.log("Clicking button");
    const isFormValidLocal = checkFormValidity();
    const isDisabledLocal = subtotal < minimo || !isFormValidLocal;
    if (isDisabledLocal) {
      console.log("DISABLED")
      setClickedWhenDisabled(true);

    } else {

      handleSubmit();
    }
  };



  // Message for the tooltip when the button is disabled
  const tooltipMessage = subtotal < minimo 
    ? `El total debe ser de al menos ${minimo} soles para proceder al pago.` 
    : `Por favor, complete todos los campos obligatorios. Recuerde seleccionar su ubicación en el mapa.`;

  return (
    <div className="bg-cremaFondo p-6 pb-12">
      <div className="flex flex-col gap-y-4 bg-cremaFondo">
        <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
          Total Carrito
        </Heading>
        <Divider />
        <CartTotals data={carrito} onSetCostoEnvio={setCostoEnvio} isAuthenticated={isAuthenticated}/>

        {subtotal < minimo && !loading && (
          <p className="text-red-400 text-sm font-poppins mt-2 text-center">
            El total debe ser de al menos {minimo} soles para proceder al pago.
          </p>
        )}
        {showWarnings && !isFormValid && (
          <p className="text-red-400 text-sm font-poppins mt-2 text-center">
            Por favor, complete todos los campos obligatorios. Recuerde seleccionar su ubicación en el mapa.
          </p>
        )}
        {
          showErrorValidacion && clickedWhenDisabled  && (
            <p className="text-red-400 text-sm font-poppins mt-2 text-center">
              {mensajeErrorValidacion}
            </p>
          )
        }
        <div className="w-full flex justify-center">
  <button
    onClick={(e) => {
      if (isDisabled) {
        setClickedWhenDisabled(true); // Track the click
        e.preventDefault(); // Prevent any unintended behavior
      } else {
        handleClick(); // Normal click handler
        if (href) {
          window.location.href = href; // Navigate to the specific href if provided
        }
      }
    }}
    onMouseEnter={() => {
      if (isDisabled) {
        setClickedWhenDisabled(true);
      }
    }}
    className={`w-1/2 h-12 bg-transparent border border-black text-black rounded-2xl mx-auto mt-4 hover:bg-gray-100 ${
      isDisabled ? "cursor-not-allowed opacity-50" : ""
    }`}
    title={isDisabled ? tooltipMessage : undefined}
  >
    Pasa a comprar
  </button>
</div>
      </div>
    </div>
  );
};

export default Summary2;
