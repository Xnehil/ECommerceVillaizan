"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Producto } from "types/PaqueteProducto";
import axios from 'axios';
import { addItem, updateLineItem } from "@modules/cart/actions";
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Producto | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      axios.get(`${baseUrl}/admin/producto/${id}`)
        .then((response) => {
          const data = response.data.producto;
          const productData: Producto = {
            id: data.id,
            tipoProducto: data.tipoProducto || { nombre: "Sin categoría" },
            subcategorias: data.subcategorias || [],
            frutas: data.frutas || [],
            inventarios: data.inventarios || [],
            promocion: data.promocion || null,
            codigo: data.codigo,
            nombre: data.nombre,
            precioA: data.precioA || 0,
            precioB: data.precioB || 0,
            precioC: data.precioC || 0,
            precioEcommerce: data.precioEcommerce || 0,
            urlImagen: data.urlImagen,
            cantMinPed: data.cantMinPed || 0,
            cantMaxPed: data.cantMaxPed || 0,
            descripcion: data.descripcion || "No disponible",
            informacionNutricional: data.informacionNutricional || "No disponible",
            seVendeEcommerce: data.seVendeEcommerce,
            usuarioActualizacion: data.usuarioActualizacion || null,
            estaActivo: data.estaActivo || true,
            desactivadoEn: data.desactivadoEn || null,
            usuarioCreacion: data.usuarioCreacion || null,
          };
          setProduct(productData);
        })
        .catch((error) => {
          console.error("Error al obtener el producto:", error);
        });
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.inventarios[0]?.stock === 0) {
      setError("Este producto está fuera de stock.");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      let precioProducto = product.precioEcommerce;
      if (isAuthenticated && product.promocion && product.promocion.porcentajeDescuento) {
        const porcentaje = product.promocion.porcentajeDescuento;
        precioProducto -= (precioProducto * porcentaje) / 100;
      }

      const detalleAnterior = carrito?.detalles.find(
        (detalle) => detalle.producto.id === product.id
      );

      let nuevoDetalle = null;

      if (detalleAnterior) {
        const cantidad = detalleAnterior.cantidad + 1;
        await updateLineItem({
          detallePedidoId: detalleAnterior.id,
          cantidad,
          subtotal: detalleAnterior.precio * cantidad,
        });
        nuevoDetalle = { ...detalleAnterior, cantidad, subtotal: detalleAnterior.precio * cantidad };
      } else {
        const response = await addItem({
          cantidad: 1,
          idProducto: product.id,
          precio: precioProducto,
          idPedido: carrito?.id || "",
          idPromocion: product.promocion?.id || "",
        });

        if (response && typeof response === "object" && "detallePedido" in response) {
          nuevoDetalle = response.detallePedido;
          if (nuevoDetalle) {
            nuevoDetalle.producto = product;
          } else {
            throw new Error("No se pudo crear o actualizar el detalle del producto.");
          }
        } else {
          throw new Error("Error al agregar el producto al carrito.");
        }
      }

      if (nuevoDetalle) {
        const nuevosDetalles = carrito?.detalles.map((detalle) =>
          detalle.producto.id === product.id ? nuevoDetalle : detalle
        ) || [];
        if (!detalleAnterior) {
          nuevosDetalles.push(nuevoDetalle);
        }
        setCarrito((prevCarrito) => ({
          ...prevCarrito,
          detalles: nuevosDetalles,
          estado: prevCarrito?.estado || "",
        }));
      }
    } catch (error) {
      console.error("Error en handleAddToCart:", error);
      setError("No se pudo añadir este producto al carrito. Por favor, inténtalo de nuevo más tarde.");
    } finally {
      setIsAdding(false);
    }
  };
  if (!id) {
    return <div>Cargando...</div>;
  }

  if (!product) {
    return <div>Cargando producto...</div>;
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-b from-red-100 to-white ">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start">
        {/* Imagen */}
        <div className="lg:w-1/2 w-full flex justify-center mb-4 lg:mb-0">
          <img
            src={product.urlImagen}
            alt={product.nombre}
            className="w-full max-w-md h-auto object-cover rounded-lg shadow-md"
          />
        </div>
        
        {/* Información del producto */}
        <div className="lg:w-1/2 w-full lg:pl-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center lg:text-left">{product.nombre}</h1>
          <div className="space-y-4 text-left">
            <p className="text-gray-700 text-lg"><strong>Descripción:</strong> {product.descripcion || "No disponible"}</p>
            <p className="text-gray-700 text-lg"><strong>Categoría:</strong> {product.tipoProducto?.nombre || "Sin categoría"}</p>
            <p className="text-gray-700 text-lg"><strong>Información Nutricional:</strong> {product.informacionNutricional || "No disponible"}</p>
            <p className="text-2xl font-semibold text-yellow-600"><strong>Precio:</strong> S/ {product.precioEcommerce}</p>
            {product.promocion && (
              <p className="text-green-600 text-lg"><strong>Promoción:</strong> {product.promocion.descripcion}</p>
            )}
                        {/* Botón Agregar al Carrito */}
            <button
              onClick={handleAddToCart}
              className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors duration-200"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
