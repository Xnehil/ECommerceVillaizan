import { Text } from "@medusajs/ui"
import { Region } from "@medusajs/medusa"
import Thumbnail from "../thumbnail"
import { Producto } from "types/PaqueteProducto"
import { useState } from "react"
import { addItem, updateLineItem } from "@modules/cart/actions"
import { DetallePedido, Pedido } from "types/PaquetePedido"

export default function ProductPreview({
  productPreview,
  isFeatured,
  region,
  carrito,
  setCarrito,
}: {
  productPreview: Producto
  isFeatured?: boolean
  region?: Region
  carrito: Pedido | null
  setCarrito: React.Dispatch<React.SetStateAction<Pedido | null>>
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cheapestPrice = productPreview.precioEcommerce
  const detalleAnterior = carrito?.detalles.find(
    (detalle) => detalle.producto.id === productPreview.id
  )
  const cantidadActual = detalleAnterior?.cantidad || 0

  const handleAddToCart = async () => {
    if (!productPreview?.id) return null

    if (productPreview.inventarios[0].stock === 0) {
      setError("Este producto está fuera de stock.")
      return
    }

    setIsAdding(true)
    setError(null)

    try {
      // Agregar al carritoState para que se actualice el carrito visualmente
      const detalleAnterior = carrito?.detalles.find(
        (detalle) => detalle.producto.id === productPreview.id
      )
      console.log("Detalle anterior:", detalleAnterior)
      let nuevoDetalle: DetallePedido | null = null
      console.log("Linea a")

      if (detalleAnterior) {
        // Actualizar la cantidad si ya existe en el carrito
        const cantidad = detalleAnterior.cantidad + 1
        await updateLineItem({
          detallePedidoId: detalleAnterior.id,
          cantidad: cantidad,
          subtotal: productPreview.precioEcommerce * cantidad,
        })
        nuevoDetalle = {
          ...detalleAnterior,
          cantidad: cantidad,
          subtotal: productPreview.precioEcommerce * cantidad,
        }
      } else {
        // Agregar un nuevo producto al carrito si no existe
        const response = await addItem({
          cantidad: 1,
          idProducto: productPreview.id || "",
          precio: productPreview.precioEcommerce,
          idPedido: carrito?.id || "",
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
          subtotal: productPreview.precioEcommerce * cantidad,
        })
        const nuevoDetalle = {
          ...detalleAnterior,
          cantidad: cantidad,
          subtotal: productPreview.precioEcommerce * cantidad,
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
    <div className="relative group">
      {/* Thumbnail */}
      <Thumbnail
        thumbnail={productPreview.urlImagen}
        size="full"
        isFeatured={isFeatured}
      />

      {/* Botón Agregar, Cantidad, y Remover */}
      {cantidadActual > 0 ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
          <button
            onClick={handleRemoveFromCart}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-full shadow-lg"
          >
            -
          </button>
          <div className="mx-4 bg-white text-yellow-500 font-bold w-32 h-32 flex items-center justify-center rounded-full shadow-lg text-4xl">
            {cantidadActual}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-full shadow-lg"
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-yellow-500 text-white font-bold py-2 px-4 rounded"
        >
          {isAdding ? "Añadiendo..." : "Agregar"}
        </button>
      )}

      {/* Mensaje de error */}
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

      {/* Información del producto */}
      <div className="flex txt-compact-medium mt-4 justify-between">
        <Text className="text-ui-fg-subtle" data-testid="product-title">
          {productPreview.nombre}
        </Text>
        <div className="flex items-center gap-x-2">
          {cheapestPrice && <span>{`S/. ${cheapestPrice}`}</span>}
        </div>
      </div>
    </div>
  )
}
