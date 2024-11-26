import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import React, { useState } from "react"

import { deleteLineItem } from "@modules/cart/actions"
import axios from "axios"
import { DetallePedido, Pedido } from "types/PaquetePedido"

const DeleteButton = ({
  itemParam,
  children,
  className,
  cart,
  setCart,
  onDelete,
}: {
  itemParam: Omit<DetallePedido, "beforeInsert">
  children?: React.ReactNode
  className?: string
  cart?: Pedido,
  setCart?: any
  onDelete?: () => void,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const urlBase = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

  const handleDelete = async (itemParam: Omit<DetallePedido, "beforeInsert">) => {
    setIsDeleting(true)
    try {
      if (cart && setCart) {
        const updatedCart = cart.detalles.filter((item) => item.id !== itemParam.id)
        setCart({ ...cart, detalles: updatedCart }) 
      }
      console.log("Deleting item:")
      if(itemParam.promocion && !!itemParam.promocion.limiteStock) {
        console.log("Updating promo stock")
        const responseGet = await axios.get(`${urlBase}/admin/promocion/${itemParam.promocion.id}`)
        if(responseGet.data.error) {
          throw new Error(responseGet.data.error)
        }
        const promoResponse = responseGet.data.promocion
        console.log("The body of the response is:", promoResponse)
        console.log("Item param is:", itemParam)
        console.log("Id of the promo is:", itemParam.promocion.id)
        console.log("The body that is being sent is:", {limiteStock: promoResponse.limiteStock + itemParam.cantidad, esValido: true})
        const responseUpdate = await axios.put(`${urlBase}/admin/promocion/${itemParam.promocion.id}`, {limiteStock: promoResponse.limiteStock + itemParam.cantidad, esValido: true})
        if(responseUpdate.data.error) {
          throw new Error(responseUpdate.data.error)
        }
            
      }
      console.log("Done updating promo stock")
      
      if (onDelete) {
        onDelete()
      }
      const response = await axios.delete(`${urlBase}/admin/detallePedido/${itemParam.id}`)
      // console.log("Deleted item:", response)
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
        onClick={() => handleDelete(itemParam)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash color="#B88E2F" />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
