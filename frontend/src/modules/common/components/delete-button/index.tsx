import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import React, { useState } from "react"

import { deleteLineItem } from "@modules/cart/actions"
import axios from "axios"
import { Pedido } from "types/PaquetePedido"

const DeleteButton = ({
  id,
  children,
  className,
  cart,
  setCart,
  onDelete
}: {
  id: string
  children?: React.ReactNode
  className?: string
  cart?: Pedido,
  setCart?: any
  onDelete?: () => void
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const urlBase = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      if (cart && setCart) {
        const updatedCart = cart.detalles.filter((item) => item.id !== id)
        setCart({ ...cart, detalles: updatedCart }) 
      } 
      if (onDelete) {
        onDelete
      }
      const response = await axios.delete(`${urlBase}/admin/detallePedido/${id}`)
      console.log("Deleted item:", response)
    } catch (error) {
      console.error("Error deleting item:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash color="#B88E2F" />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
