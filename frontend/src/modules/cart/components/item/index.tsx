"use client"

import { LineItem, Region } from "@medusajs/medusa"
import { Table, Text, clx } from "@medusajs/ui"

import CartItemSelect from "@modules/cart/components/cart-item-select"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"
import { updateLineItem } from "@modules/cart/actions"
import Spinner from "@modules/common/icons/spinner"
import { useState } from "react"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { DetallePedido, Pedido } from "types/PaquetePedido"
import Link from "next/link"

type ItemProps = {
  item: Omit<DetallePedido, "beforeInsert">
  type?: "full" | "preview"
  onDelete: () => void
}

const Item = ({ item,  type = "full", onDelete}: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handle  = item.producto.id

  const changeQuantity = async (nuevaCantidad: number) => {
    setError(null)
    setUpdating(true)

    const message = await updateLineItem({
      detallePedidoId: item.id,
      cantidad: nuevaCantidad,
      subtotal: nuevaCantidad * item.precio
    })
      .catch((err) => {
        setError(err.message)
        return err.message
      })
      .finally(() => {
        setUpdating(false)
        item.cantidad = nuevaCantidad
        item.subtotal = nuevaCantidad  * item.precio
      })
    setCantidad(nuevaCantidad)
    message && setError(message)
  }

  const [cantidad, setCantidad] = useState(item.cantidad);

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 30) {
      setCantidad(value);
      changeQuantity(value);
    }
  };

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <Link
          href={`/products/${handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail thumbnail={item.producto.urlImagen} size="square" />
        </Link>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text className="text-[#9f9f9f] text-base font-normal font-poppins" data-testid="product-title">{item.producto.nombre}</Text>
        {/* <LineItemOptions variant={item.variant} data-testid="product-variant" /> */}
      </Table.Cell>

      

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice item={item} style="tight" />
        </Table.Cell>
      )}

      {type === "full" && (
              <Table.Cell>
                <div className="flex gap-2 items-center w-full justify-center">
                <button
                  className={`w-8 h-8 flex items-center justify-center bg-cremaFondo rounded text-black font-black ${item.cantidad <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => changeQuantity(item.cantidad - 1)}
                  disabled={item.cantidad <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={cantidad}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-center no-spinner"
                />
                <button
                  className="w-8 h-8 flex items-center justify-center bg-cremaFondo rounded text-black font-black cursor-pointer"
                  onClick={() => changeQuantity(item.cantidad + 1)}
                  disabled={item.cantidad >= 30} 
                >
                  +
                </button>
                {updating && <Spinner />}
                </div>
                <ErrorMessage error={error} data-testid="product-error-message" />
              </Table.Cell>
            )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.cantidad}x </Text>
              <LineItemUnitPrice item={item}  style="tight" />
            </span>
          )}
          <LineItemPrice item={item}  />
        </span>
      </Table.Cell>

      <Table.Cell className="!pr-0 justify-end pl-2">  
        <DeleteButton id={item.id}  onDelete={onDelete} />
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
