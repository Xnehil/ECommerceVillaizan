"use client"

import { Popover, Transition } from "@headlessui/react"
import { Cart } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

import { formatAmount } from "@lib/util/prices"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import Link from "next/link"
import { Pedido } from "types/PaquetePedido"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: Omit<Pedido, "beforeInsert" | "afterLoad"> | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.detalles?.reduce((acc, item) => {
      return acc + item.cantidad
    }, 0) || 0

  const itemRef = useRef<number>(totalItems || 0)
  const defaultUrl = "https://via.placeholder.com/150"
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
    console.log("Cart state:", cartState);
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
        <Popover.Button className="h-full">
          <Link
            className="hover:text-ui-fg-base text-sans"
            style={{ color: "#FFFEFE", fontSize: "28px", fontStyle: "normal", fontWeight: 600, lineHeight: "normal" }}
            href="/cart"
          >{`Comprar (${totalItems})`}</Link>
        </Popover.Button>
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
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-cremaFondo border-x border-b border-gray-200 w-[420px] text-ui-fg-base"
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
                      return a.creadoEn > b.creadoEn ? -1 : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <Link
                          href={`/products/${item.id}`}
                          className="w-24"
                        >
                          <Thumbnail thumbnail={item.producto.urlImagen} size="square" />
                        </Link>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                  <LocalizedClientLink
                                    href={`/products/${item.producto.urlImagen || defaultUrl}`}
                                    data-testid="product-link"
                                  >
                                    {item.producto.nombre}
                                  </LocalizedClientLink>
                                </h3>
                                <LineItemOptions
                                  variant={item.producto}
                                  data-testid="cart-item-variant"
                                />
                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.cantidad}
                                >
                                  Cantidad: {item.cantidad}
                                </span>
                              </div>
                              <div className="flex justify-end">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                />
                              </div>
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
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
                      {cartState.total}
                    </span>
                  </div>
                  <LocalizedClientLink href="/carrito" passHref>
                    <Button
                      className="w-full"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      Go to cart
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex flex-col gap-y-4 items-center justify-center p-2">
                  <span>Tu carrito está vacío. Añade más helados y disfruta el sabor de la auténtica fruta</span>
                  <div className="mb-4">
                    <Link href="/comprar">
                      <>
                        <span className="sr-only">Ir al catálogo</span>
                        <Button onClick={close}>Explora nuestros helados</Button>
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
