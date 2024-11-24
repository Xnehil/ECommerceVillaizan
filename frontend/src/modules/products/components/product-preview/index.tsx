import { Text } from "@medusajs/ui"
import { Region } from "@medusajs/medusa"
import Thumbnail from "../thumbnail"
import { Producto } from "types/PaqueteProducto"
import { addItem, updateLineItem } from "@modules/cart/actions"
import { DetallePedido, Pedido } from "types/PaquetePedido"
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/tooltip";

import InputWithLabel from "@components/inputWithLabel";
import React, { useEffect, useRef, useState } from "react";
//ACAA
//import "@/styles/general.css";
import { Label } from "@components/label";
import { Button } from "@components/Button";
import { Skeleton } from "@components/ui/skeleton";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";


const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export default function ProductPreview({
  productPreview,
  isFeatured,
  region,
  carrito,
  setCarrito,
  isAuthenticated,
}: {
  productPreview: Producto
  isFeatured?: boolean
  region?: Region
  carrito: Pedido | null
  setCarrito: React.Dispatch<React.SetStateAction<Pedido | null>>
  isAuthenticated: boolean
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existeDescuento, setExisteDescuento] = useState(false)
  const [estaAutenticado, setEstaAutenticado] = useState(false)
  const [cheapestPriceMostrar, setCheapestPriceMostrar] = useState(productPreview.precioEcommerce)

  const precioNormal = productPreview.precioEcommerce
  const detalleAnterior = carrito?.detalles.find(
    (detalle) => detalle.producto.id === productPreview.id
  )
  const cantidadActual = detalleAnterior?.cantidad || 0

  useEffect(() => {
    if (isAuthenticated) {
      setEstaAutenticado(true)
      //if productPreview tiene promocion, calcular el precio más barato
      if (productPreview.promocion && productPreview.promocion.esValido && productPreview.promocion.porcentajeDescuento) {
        const porcentaje = productPreview.promocion.porcentajeDescuento
        const precioDescuento = precioNormal - (precioNormal * porcentaje) / 100
        setCheapestPriceMostrar(precioDescuento)
        setExisteDescuento(true)
      }
      else{
        setExisteDescuento(false)
      }
    } 
  }, [isAuthenticated, productPreview]);

    // Verificar si el producto tiene stock
    if (productPreview.inventarios[0].stock === 0) {
      return null
    }

  const handleAddToCart = async () => {
    if (!productPreview?.id) return null

    if (productPreview.inventarios[0].stock === 0) {
      setError("Este producto está fuera de stock.")
      return
    }

    setIsAdding(true)
    setError(null)

    try {

      if(estaAutenticado && productPreview.promocion && productPreview.promocion.esValido && productPreview.promocion.limiteStock && productPreview.promocion.limiteStock >0) {
        const responseGet = await axios.get(`${baseUrl}/admin/promocion/${productPreview.promocion.id}`);
        if(responseGet.data.error) {
          throw new Error(responseGet.data.error)
        }
        const promoResponse = responseGet.data.promocion;
        //console.log("The body of the response is:", promoResponse)
        //console.log("The body that is being sent is:", {limiteStock: promoResponse.limiteStock - 1})
        const responseUpdate = await axios.put(`${baseUrl}/admin/promocion/${productPreview.promocion.id}`, {limiteStock: promoResponse.limiteStock - 1});
        
        if(responseUpdate.data.error) {
          throw new Error(responseUpdate.data.error)
        }
        productPreview.promocion.limiteStock = promoResponse.limiteStock - 1;
        if(productPreview.promocion.limiteStock === 0) {
          const responseUpdate = await axios.put(`${baseUrl}/admin/promocion/${productPreview.promocion.id}`, {esValido: false});
          if(responseUpdate.data.error) {
            throw new Error(responseUpdate.data.error)
          }
          productPreview.promocion.esValido = false;
        }
      }


      let precioProducto = productPreview.precioEcommerce
      if(isAuthenticated){
        if (productPreview.promocion && productPreview.promocion.porcentajeDescuento) {
          const porcentaje = productPreview.promocion.porcentajeDescuento
          precioProducto = precioNormal - (precioNormal * porcentaje) / 100
        }
      }

      // Agregar al carritoState para que se actualice el carrito visualmente
      const detalleAnterior = carrito?.detalles.find(
        (detalle) => detalle.producto.id === productPreview.id
      )
      console.log("Detalle anterior:", detalleAnterior)
      let nuevoDetalle: DetallePedido | null = null

      if (detalleAnterior) {
        // Actualizar la cantidad si ya existe en el carrito
        const cantidad = detalleAnterior.cantidad + 1
        const responseUpdateLineItemData = await updateLineItem({
          detallePedidoId: detalleAnterior.id,
          cantidad: cantidad,
          subtotal: detalleAnterior.precio * cantidad,
        })
        console.log("Respuesta de updateLineItem:", responseUpdateLineItemData)
        nuevoDetalle = {
          ...detalleAnterior,
          cantidad: cantidad,
          subtotal: detalleAnterior.precio * cantidad,
        }
      } else {
        // Agregar un nuevo producto al carrito si no existe
        const response = await addItem({
          cantidad: 1,
          idProducto: productPreview.id || "",
          //precio: productPreview.precioEcommerce,
          precio: precioProducto,
          idPedido: carrito?.id || "",
          idPromocion: productPreview.promocion?.id || "",
        })
        if (
          response &&
          typeof response === "object" &&
          "detallePedido" in response
        ) {
          nuevoDetalle = response.detallePedido
          if (nuevoDetalle) {
            nuevoDetalle.producto = productPreview
          } else {
            throw new Error(
              "Error: No se pudo crear o actualizar el detalle del producto."
            )
          }
        } else {
          throw new Error("Error al agregar el producto al carrito.")
        }
      }

      if (nuevoDetalle) {
        const nuevosDetalles =
          carrito?.detalles.map((detalle) =>
            detalle.producto.id === productPreview.id ? nuevoDetalle : detalle
          ) || []
        if (!detalleAnterior) {
          nuevosDetalles.push(nuevoDetalle)
        }
        setCarrito(
          (prevCarrito) =>
            ({
              ...prevCarrito,
              detalles: nuevosDetalles,
              estado: prevCarrito?.estado || "",
            } as Pedido)
        )
      }
    } catch (error) {
      console.error("Error in handleAddToCart:", error)
      setError(
        "No se pudo añadir este producto al carrito. Por favor, inténtalo de nuevo más tarde."
      )
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveFromCart = async () => {
    if (!productPreview?.id) return null
    setIsAdding(true)
    setError(null) // Limpiar cualquier error anterior

    try {
      // Verificar si ya existe el producto en el carrito y actualizar la cantidad
      const detalleAnterior = carrito?.detalles.find(
        (detalle) => detalle.producto.id === productPreview.id
      )
      if (detalleAnterior && detalleAnterior.cantidad > 1) {
        const cantidad = detalleAnterior.cantidad - 1
        await updateLineItem({
          detallePedidoId: detalleAnterior.id,
          cantidad: cantidad,
          subtotal: detalleAnterior.precio * cantidad,
        })
        const nuevoDetalle = {
          ...detalleAnterior,
          cantidad: cantidad,
          subtotal: detalleAnterior.precio * cantidad,
        }

        const nuevosDetalles =
          carrito?.detalles.map((detalle) =>
            detalle.producto.id === productPreview.id ? nuevoDetalle : detalle
          ) || []

        setCarrito(
          (prevCarrito) =>
            ({
              ...prevCarrito,
              detalles: nuevosDetalles,
              estado: prevCarrito?.estado || "",
            } as Pedido)
        )
      } else if (detalleAnterior && detalleAnterior.cantidad === 1) {
        // Eliminar el producto si la cantidad es 1 y se presiona el botón de restar
        await updateLineItem({
          detallePedidoId: detalleAnterior.id,
          cantidad: 0,
          subtotal: 0,
        })
        const nuevosDetalles =
          carrito?.detalles.filter(
            (detalle) => detalle.producto.id !== productPreview.id
          ) || []

        setCarrito(
          (prevCarrito) =>
            ({
              ...prevCarrito,
              detalles: nuevosDetalles,
              estado: prevCarrito?.estado || "",
            } as Pedido)
        )
      }
    } catch (error) {
      console.error("Error in handleRemoveFromCart:", error)
      setError(
        "No se pudo quitar este producto del carrito. Por favor, inténtalo de nuevo más tarde."
      )
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Thumbnail */}
      <Thumbnail
        thumbnail={productPreview.urlImagen}
        size="full"
        isFeatured={isFeatured}
      />
        {/* Ícono de Información en la esquina superior derecha */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link href={`/producto/${productPreview.id}`}>
          {/*<button className="bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition" aria-label="Más información">
            <img src="/images/boton-de-informacion.png" alt="Información" className="w-5 h-5" />
          </button>*/}
          {/* Tooltip */}
          {isAuthenticated && productPreview.cantidadPuntos ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center justify-center h-full px-2 py-1 text-xs bg-gray-200 rounded-full">
                  i
                </TooltipTrigger>
                <TooltipContent className="w-48 h-auto p-2">
                  <p className="w-full break-words">
                    Con la compra de este producto, consigues <strong>{`${productPreview.cantidadPuntos}`}</strong> Puntos Canjeables
                  </p>
                  <p className="w-full break-words font-bold">Ver Detalles</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center justify-center h-full px-2 py-1 text-xs bg-gray-200 rounded-full">
                  i
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-full break-words font-bold">Ver Detalles</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

        </Link>
      </div>
      {/* Botón Agregar, Cantidad, y Remover */}
      {cantidadActual > 0 ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
          <button
            onClick={handleRemoveFromCart}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-200"
          >
            -
          </button>
          <div className="mx-4 bg-white text-yellow-500 font-bold w-32 h-32 flex items-center justify-center rounded-full shadow-lg text-4xl">
            {cantidadActual}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-200 ${isAdding ? "opacity-50" : ""}`}
          >
            {isAdding ? "Añadiendo..." : "+"}
          </button>
        </div>
      ) : (
        productPreview.inventarios[0].stock > 0 && (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow-lg"
          >
            {isAdding ? "Añadiendo..." : "Agregar"}
          </button>
        )
      )}
  
      {/* Mensaje de error */}
      {error && (
        <div className="mt-2 text-red-500 text-sm bg-red-100 rounded p-2 flex items-center">
          <span className="material-icons">error_outline</span>
          <span className="ml-2">{error}</span>
        </div>
      )}
  
      {/* Stock limitado */}
      {!productPreview.inventarios[0].stock ? (
        <div className="mt-2 text-red-500 text-sm bg-red-100 rounded p-2">
          Este producto no está disponible en tu ciudad
        </div>
      ) : (
        productPreview.inventarios[0].stock <= productPreview.inventarios[0].stockMinimo && (
          <div className="mt-2 text-red-500 text-sm bg-red-100 rounded p-2">
            Stock limitado: quedan pocas unidades disponibles en tu ciudad
          </div>
        )
      )}
  
      {/* Información del producto */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Text
            className="text-xl font-semibold text-gray-800 whitespace-normal"
            data-testid="product-title"
          >
            {productPreview.nombre}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPriceMostrar && (
              <span className="text-lg font-bold text-yellow-600" style={{ whiteSpace: 'nowrap' }}>
                {`S/ ${Number(cheapestPriceMostrar).toFixed(2)}`}
              </span>
            )}
            {existeDescuento && precioNormal && (
              <span className="text-lg text-gray-500 line-through" style={{ whiteSpace: 'nowrap' }}>
                {`S/ ${Number(precioNormal).toFixed(2)}`}
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  )
  
}
