import { Text } from "@medusajs/ui"
import { Region } from "@medusajs/medusa"
import Thumbnail from "../thumbnail"
import { Producto } from "types/PaqueteProducto"
import { useState } from "react"
import { addItem, addToCart, updateLineItem } from "@modules/cart/actions"
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
  const [isAdding, setIsAdding] = useState(false)  // Estado para manejar la acción de agregar
  const [error, setError] = useState<string | null>(null)  // Estado para manejar errores
  const cheapestPrice = productPreview.precioEcommerce;

  // Función handleAddToCart para agregar al carrito
  const handleAddToCart = async () => {
    if (!productPreview?.id) return null;
    setIsAdding(true);
    setError(null);  // Limpiar cualquier error anterior

    try {
      // Agregar al carritoState para que se actualice el carrito visualmente
      const detalleAnterior = carrito?.detalles.find((detalle) => detalle.producto.id === productPreview.id);
      let nuevoDetalle = null;
      if (detalleAnterior) {
        const cantidad = detalleAnterior.cantidad + 1;
        await updateLineItem({ detallePedidoId: detalleAnterior.id, cantidad: cantidad, subtotal: productPreview.precioEcommerce * cantidad });
        nuevoDetalle = { ...detalleAnterior, cantidad: cantidad, subtotal: productPreview.precioEcommerce * cantidad };
      } else {
        const response = await addItem({
          cantidad: 1,
          idProducto: productPreview.id || "",
          precio: productPreview.precioEcommerce,
          idPedido: carrito?.id || "",
        });
        if (response && typeof response === 'object' && 'detallePedido' in response) {
          nuevoDetalle = response.detallePedido;
          nuevoDetalle.producto = productPreview;
        } else {
          throw new Error("Error al agregar el producto al carrito.");
        }
      }

      if (nuevoDetalle) {
        const nuevosDetalles = carrito?.detalles.map((detalle) => 
          detalle.producto.id === productPreview.id ? nuevoDetalle : detalle
        ) || [];
        if (!detalleAnterior) {
          nuevosDetalles.push(nuevoDetalle);
        }
        setCarrito((prevCarrito) => ({
          ...prevCarrito,
          detalles: nuevosDetalles,
          estado: prevCarrito?.estado || "", // Asegurarse que estado sea una cadena
          // Agregar otras propiedades con valores predeterminados si es necesario
        } as Pedido));
      }
    } catch (error) {
      console.error("Error in handleAddToCart:", error);
      setError("No se pudo añadir este producto al carrito. Por favor, inténtalo de nuevo más tarde.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative group">
      {/* Thumbnail */}
      <Thumbnail
        thumbnail={productPreview.urlImagen}
        size="full"
        isFeatured={isFeatured}
      />

      {/* Botón Agregar */}
      <button
        onClick={handleAddToCart}  // Ejecuta handleAddToCart
        disabled={isAdding}  // Deshabilita el botón mientras se está añadiendo al carrito
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-yellow-500 text-white font-bold py-2 px-4 rounded"
      >
        {isAdding ? "Añadiendo..." : "Agregar"}
      </button>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}

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
