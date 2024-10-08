import { Text } from "@medusajs/ui"
import { Region } from "@medusajs/medusa"
import Thumbnail from "../thumbnail"
import { Producto } from "types/PaqueteProducto"
import { useState } from "react"
import { addToCart } from "@modules/cart/actions"

export default function ProductPreview({
  productPreview,
  isFeatured,
  region,
}: {
  productPreview: Producto
  isFeatured?: boolean
  region?: Region
}) {
  const [isAdding, setIsAdding] = useState(false)  // Estado para manejar la acción de agregar
  const cheapestPrice = productPreview.precioEcommerce;

  // Función handleAddToCart para agregar al carrito
  const handleAddToCart = async () => {
    if (!productPreview?.id) return null;

    setIsAdding(true);

    await addToCart({
      cantidad: 1,
      idProducto: productPreview.id || "",
      precio: productPreview.precioEcommerce
    });

    setIsAdding(false);
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
        onClick={handleAddToCart}  // Ahora el botón ejecuta handleAddToCart para agregar directamente al carrito
        disabled={isAdding}  // Deshabilita el botón mientras se está añadiendo al carrito
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-yellow-500 text-white font-bold py-2 px-4 rounded"
      >
        {isAdding ? "Añadiendo..." : "Agregar"}
      </button>

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
