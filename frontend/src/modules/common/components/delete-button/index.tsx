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
      console.log("Deleting item:", itemParam)
      if(itemParam.promocion && !!itemParam.promocion.limiteStock) {
        console.log("Item param is:", itemParam)
        console.log("Id of the promo is:", itemParam.promocion.id)
        console.log("The body that is being sent is:", {cantidad: itemParam.cantidad, operacion: "+"})
        const responseUpdate = await axios.patch(`${urlBase}/admin/promocion/${itemParam.promocion.id}`, {cantidad: itemParam.cantidad, operacion: "+"})
        if(responseUpdate.data.error) {
          throw new Error(responseUpdate.data.error)
        }
        // try{
        //   const response = await axios.put(`${baseUrl}/admin/promocion/${item.promocion.id}`, {limiteStock: item.promocion.limiteStock, esValido: item.promocion.esValido})
        //   if(response.data.error){
        //     setError(response.data.message)
        //   }
        //   console.log("Se actualizo el stock de la promocion")
        //   onChangePromo()
        //   console.log("Se actualizo la promocion de los detalles")
        // }
        // catch(error){
        //   setError('Error al actualizar el stock de la promoción')
        //   console.error("ERROR al actualizar el stock de la promocion", error)
        //   setUpdating(false)
        // }
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
