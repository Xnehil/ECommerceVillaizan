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
import { useEffect, useRef, useState } from "react"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { DetallePedido, Pedido } from "types/PaquetePedido"
import Link from "next/link"
import axios from "axios"
import { Promocion } from "types/PaquetePromocion"

type ItemProps = {
  item: Omit<DetallePedido, "beforeInsert">
  type?: "full" | "preview"
  onDelete: () => void
  isAuthenticated: boolean
  onChangePromo: () => void
  items: DetallePedido[]
  setItems: (items: DetallePedido[]) => void
}

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const Item = ({ item,  type = "full", onDelete, isAuthenticated, onChangePromo, items, setItems }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [noMoreStock, setNoMoreStock] = useState(false)
  const [noMorePromoStock, setNoMorePromoStock] = useState(false)
  const [cantidad, setCantidad] = useState(item.cantidad);
  const prevCantidadRef = useRef<number>(item.cantidad);
  const handle  = item.producto.id



  const checkStockPlusOne = (item: DetallePedido) => {
    /*
    if (item.producto.cantidadStock < item.cantidad) {
      setNoMoreStock(true)
    } else {
      setNoMoreStock(false)
    }
      */
    if (item.promocion && item.promocion.limiteStock && item.promocion.limiteStock - 1 < 0) {
      setNoMorePromoStock(true)
    } else {
      setNoMorePromoStock(false)
    }
  }

  const changeQuantity = async (nuevaCantidad: number, cantidadOriginal:number) => {
    setError(null)
    setUpdating(true)
    let itemActualizado : DetallePedido = {...item} 
    console.log("Se va a cambiar la cantidad de un item ", itemActualizado)
    console.log("La nueva cantidad es ", nuevaCantidad)
    console.log("La cantidad original es ", cantidadOriginal)
    //En caso de que sea una promocion, se actualiza el stock de la promocion (si es que tiene)

    if(nuevaCantidad == cantidadOriginal){
      setUpdating(false)
      return
    }
    

    if (itemActualizado.promocion && itemActualizado.promocion.limiteStock != null) {
      console.log("Se va a actualizar el stock de la promocion")
      const diff = nuevaCantidad - cantidadOriginal
      if(diff > 0){
        if(!itemActualizado.promocion.esValido){
          console.log("La promocion ya no es valida")
          setCantidad(cantidadOriginal)
          setError('¡Nos quedamos sin stock!')
          setUpdating(false)
          return
        }
        //Se estan agregando productos, por lo que se descontara del stock de promocion
        itemActualizado.promocion.limiteStock -= diff
        if(itemActualizado.promocion.limiteStock < 0){
          console.log('¡Nos quedamos sin stock!')
          setCantidad(cantidadOriginal)
          itemActualizado.promocion.limiteStock = itemActualizado.promocion.limiteStock + diff
          setError('¡Nos quedamos sin stock!')
          setUpdating(false)
          return
        }
        else if(itemActualizado.promocion.limiteStock === 0){
          setNoMorePromoStock(true)
          itemActualizado.promocion.esValido = false
        }
      }
      else{
        if(itemActualizado.promocion.limiteStock === 0){
          itemActualizado.promocion.esValido = true          
        }
        //Se estan quitando productos, por lo que se sumara al stock de promocion
        itemActualizado.promocion.limiteStock += (diff*-1)
      }
      try{
        const response = await axios.put(`${baseUrl}/admin/promocion/${itemActualizado.promocion.id}`, {limiteStock: itemActualizado.promocion.limiteStock, esValido: itemActualizado.promocion.esValido})
        if(response.data.error){
          setError(response.data.message)
        }
        console.log("Se actualizo el stock de la promocion")
        onChangePromo()
        console.log("Se actualizo la promocion de los detalles")
      }
      catch(error){
        setError('Error al actualizar el stock de la promoción')
        console.error("ERROR al actualizar el stock de la promocion", error)
        setUpdating(false)
      }
    }
    
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
        itemActualizado.cantidad = nuevaCantidad
        itemActualizado.subtotal = nuevaCantidad  * item.precio
      })
    console.log("Se actualizó itemActualizado ", itemActualizado)

    const nuevosDetalles =
      items.map((detalle) =>
        detalle.id === itemActualizado.id ? itemActualizado : detalle
      ) || [];

    setItems(nuevosDetalles)
    setCantidad(nuevaCantidad)
    //setOriginalValue(nuevaCantidad)
    message && setError(message)
  }

  

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 30) {
      
      // changeQuantity(value,originalValue);
      // setCantidad(value);
      // setOriginalValue(value)
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
                  className={`w-8 h-8 flex items-center justify-center bg-cremaFondo rounded text-black font-black ${cantidad <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => changeQuantity(cantidad - 1,cantidad)}
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10);
                    if (newValue < 1 || newValue > 30) return;
                    prevCantidadRef.current = cantidad; // Store the previous cantidad
                    setCantidad(isNaN(newValue) ? 0 : newValue); // Update cantidad
                  }}
                  onBlur={(e) => {
                    const newValue = parseInt(e.target.value, 10);
                    const previousValue = prevCantidadRef.current; // Retrieve the previous cantidad
                    changeQuantity(newValue, previousValue); // Call changeQuantity with new and previous values
                  }}
                  min="1"
                  max="30"
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-center no-spinner"
                />
                <button
                  className="w-8 h-8 flex items-center justify-center bg-cremaFondo rounded text-black font-black cursor-pointer"
                  onClick={() => {
                    checkStockPlusOne(item);
                    //En caso TENGA STOCK y (NO TENGA PROMOCION O TENGA PROMOCION Y TENGA STOCK DE PROMOCION)
                    const tieneStock = !noMoreStock
                    const esPromocion = !!item.promocion
                    const esPromocionConStockLimitado = !!item.promocion && !!item.promocion.limiteStock
                    const tieneStockDisponbilePromocion = !noMorePromoStock
                    const validoParaCambio = tieneStock && (!esPromocion || ((esPromocion && !esPromocionConStockLimitado) || (esPromocionConStockLimitado && tieneStockDisponbilePromocion)))
                    console.log("Valido para cambio: ", validoParaCambio)
                    console.log("+tieneStock: ", tieneStock);
                    console.log("+esPromocion: ", esPromocion);
                    console.log("+esPromocionConStockLimitado: ", esPromocionConStockLimitado);
                    console.log("+tieneStockDisponbilePromocion: ", tieneStockDisponbilePromocion);
                    if(validoParaCambio){
                      changeQuantity(cantidad + 1,cantidad);
                      checkStockPlusOne(item); //Deshabilita el boton de agregar si no hay stock
                    }
                  }}
                  disabled={(cantidad >= 30) || noMoreStock || 
                    (!!item.promocion?.limiteStock && !!noMorePromoStock) } 
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
          <span className="flex gap-x-1">
            <Text className="text-ui-fg-muted">{item.cantidad}x </Text>
            <LineItemUnitPrice item={item} style="tight" />
          </span>
        )}
        <div className="flex flex-col items-center justify-center space-y-1">
          <LineItemPrice item={item} />
          {isAuthenticated && item.producto && item.producto.cantidadPuntos && item.producto.cantidadPuntos > 0 && (
            <span className="text-xs text-ui-fg-subtle">
              {item.producto.cantidadPuntos * item.cantidad} puntos
            </span>
          )}
          {/* {item.promocion && item.promocion.esValido && item.promocion.porcentajeDescuento > 0 && item.promocion.limiteStock && item.promocion.limiteStock >0 && (
            <span className="text-xs text-ui-fg-subtle">
              {item.promocion.limiteStock} stock restante
            </span>
          )
          } */}
        </div>
      </span>
      </Table.Cell>

      <Table.Cell className="!pr-0 justify-end pl-2">  
        <DeleteButton itemParam={item}  onDelete={onDelete}/>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
