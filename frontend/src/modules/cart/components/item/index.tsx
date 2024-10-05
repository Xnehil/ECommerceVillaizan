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
import { DetallePedido } from "types/PaquetePedido"
import Link from "next/link"

type ItemProps = {
  item: Omit<DetallePedido, "beforeInsert">
  type?: "full" | "preview"
}

const Item = ({ item,  type = "full" }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handle  = item.producto.id

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    const message = await updateLineItem({
      detallePedidoId: item.id,
      cantidad: quantity,
    })
      .catch((err) => {
        return err.message
      })
      .finally(() => {
        setUpdating(false)
      })

    message && setError(message)
  }

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
                  className="w-8 h-8 flex items-center justify-center bg-cremaFondo rounded text-black font-black cursor-pointer"
                  onClick={() => changeQuantity(item.cantidad - 1)}
                  disabled={item.cantidad <= 1}
                >
                  -
                </button>
                <div className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded">
                  {item.cantidad}
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center bg-cremaFondo rounded text-black font-black cursor-pointer"
                  onClick={() => changeQuantity(item.cantidad + 1)}
                  disabled={item.cantidad >= 20} 
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
        <DeleteButton id={item.id} />
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
