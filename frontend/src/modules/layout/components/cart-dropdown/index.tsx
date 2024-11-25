"use client"

import { Popover, Transition } from "@headlessui/react"
import { Cart } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react"

import { formatAmount } from "@lib/util/prices"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import Link from "next/link"
import { Pedido } from "types/PaquetePedido"
import { Producto } from "types/PaqueteProducto"
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/tooltip";


const CartDropdown = ({
  cart: cartState,
  setCart
}: {
  cart?: Omit<Pedido, "beforeInsert" | "afterLoad"> | null,
  setCart: Dispatch<SetStateAction<Pedido | null>>
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const productoFake = {
    id: "1",
    nombre: "Helado de fresa",
    urlImagen: "https://picsum.photos/200/300",
    precioA: 1000,
    precioB: 2000,
    precioC: 3000,
    precioEcommerce: 4000,
    cantMinPed: 1,
    cantMaxPed: 10,
    seVendeEcommerce: true,
    subcategorias: [],
    frutas: [],
    inventarios: [],
    codigo: "123456",
    creadoEn:  new Date(),
    actualizadoEn: new Date(),
    desactivadoEn: new Date(),
    descripcion: "Helado de fresa",
    usuarioActualizacion: "admin",
    usuarioCreacion: "admin",
    estaActivo: true,
  }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: session, status } = useSession();
  const hasRunOnceAuth = useRef(false);

  useEffect(() => {
    if(status !== "loading" && !hasRunOnceAuth.current) {
      hasRunOnceAuth.current = true;
      if (session?.user?.id) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [session, status]);

  


  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.detalles?.reduce((acc, item) => {
      return acc + item.cantidad
    }, 0) || 0
  const total = cartState?.detalles?.reduce((acc, item) => {
    return acc + Number(item.subtotal);
  }, 0) || 0;

  const itemRef = useRef<number>(totalItems || 0)
  const defaultUrl = "https://picsum.photos/200/300"
  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    // console.log("Cart state:", cartState);
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer, cartState])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/carrito")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])
  
  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        {<Popover.Button className="h-full">
          <Link
            className="hover:text-ui-fg-base text-sans"
            style={{ color: "#FFFEFE", fontSize: "28px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}
            href="/carrito"
          >{`Comprar`}</Link>
        </Popover.Button>
        }
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[460px] text-ui-fg-base"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Carrito</h3>
            </div>
            {cartState && cartState.detalles?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {cartState.detalles
                    .sort((a, b) => {
                      const dateA = a.creadoEn ?? 0;
                      const dateB = b.creadoEn ?? 0;
                      return dateA > dateB ? -1 : 1;
                    })
                    .map((item) => {
                      item.producto = item.producto ?? productoFake;
                      //console.log("Item producto:", item.producto);
                      return (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <Link
                          href={`/products/${item.producto.id}`}
                          className="w-24"
                        >
                          <Thumbnail thumbnail={item.producto.urlImagen} size="square" />
                        </Link>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                <Link
                                  href={`/products/${item.producto.id || defaultUrl}`}
                                  data-testid="product-link"
                                >
                                  {item.producto.nombre}
                                  <br />
                                  {isAuthenticated && item.producto.promocion && item.producto.promocion.esValido && item.producto.promocion.porcentajeDescuento? (
                                    // Calculate discounted price
                                    <>
                                      <span
                                        style={{
                                          textDecoration: "line-through",
                                          color: "gray",
                                          marginRight: "5px",
                                        }}
                                      >
                                        {"S/ " + Number(item.producto.precioEcommerce).toFixed(2)}
                                      </span>
                                      <span style={{ color: "black" }}>
                                        {"S/ " + (
                                          item.producto.precioEcommerce -
                                          (item.producto.precioEcommerce * item.producto.promocion.porcentajeDescuento) / 100
                                        ).toFixed(2) + " c/u"}
                                      </span>
                                    </>
                                  ) : (
                                    // Show regular price
                                    <span>
                                      {"S/ " + Number(item.producto.precioEcommerce).toFixed(2) + " c/u"}
                                    </span>
                                  )}
                                </Link>

                                </h3>
                                {/* <LineItemOptions
                                  variant={item.producto}
                                  data-testid="cart-item-variant"
                                /> */}
                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.cantidad}
                                >
                                  Cantidad: {item.cantidad}
                                </span>
                              </div>
                              <div className="flex flex-col pr-4">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                />
                                {/* Show Puntos Canjeables below LineItemPrice */}
                                {isAuthenticated && item.producto && item.producto.cantidadPuntos && item.producto.cantidadPuntos > 0 && (
                                  <span className="text-sm text-gray-500 mt-1">
                                    {item.producto.cantidadPuntos * item.cantidad} puntos
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <DeleteButton
                            itemParam={item}
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                            cart={cartState}
                            setCart = {setCart}
                          >
                            Quitar
                          </DeleteButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                  <div className="flex items-center justify-between">
                    <span className="text-ui-fg-base font-semibold">
                      Subtotal{" "}
                      {/* <span className="font-normal">(excl. taxes)</span> */}
                    </span>
                    <span
                      className="text-large-semi"
                      data-testid="cart-subtotal"
                      data-value={cartState.detalles.reduce(
                        (acc, item) => acc + item.subtotal,
                        0
                      )}
                      
                    >
                      {"S/ " + total.toFixed(2)}
                    </span>
                    
                  </div>
                  <div className="flex items-center justify-between">
                    {/*Canje */}
                    {isAuthenticated && cartState.detalles && cartState.detalles.length > 0 && (
                      <>
                        <div className="flex items-center gap-x-1">
                          <span className="text-ui-fg-base font-semibold">{"Puntos Canjeables"}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center justify-center h-full px-2 py-1 text-xs bg-gray-200 rounded-full">
                                i
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-full break-words">Los Puntos Canjeables vencen cada 3 meses.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="text-large-semi">
                          {cartState.detalles.reduce((totalPuntos, detalle) => {
                            const puntos = (detalle.producto?.cantidadPuntos ?? 0) * detalle.cantidad || 0;
                            return totalPuntos + puntos;
                          }, 0)}
                        </span>
                      </>
                    )}
                  </div>
                  <Link href="/carrito" passHref>
                    <Button
                      className="w-full"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      Ir al carrito
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div>
                <div className="flex flex-col gap-y-4 items-center justify-center p-2">
                  <span>Tu carrito está vacío. Añade más paletas y disfruta el sabor de la auténtica fruta</span>
                  <div className="mb-4">
                    <Link href="/comprar">
                      <>
                        <span className="sr-only">Ir al catálogo</span>
                        <Button onClick={close}>Explora nuestras paletas</Button>
                      </>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
