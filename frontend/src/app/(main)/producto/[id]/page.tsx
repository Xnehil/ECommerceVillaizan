"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Producto } from "types/PaqueteProducto";
import { Pedido } from "types/PaquetePedido";
import axios from 'axios';
import { addItem, updateLineItem, getOrSetCart, enrichLineItems } from "@modules/cart/actions";
import BackButton from "@components/BackButton";
import { useSession } from 'next-auth/react';
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Producto | null>(null);
  const [carrito, setCarrito] = useState<Pedido | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: session, status } = useSession();
  const [existenPuntos, setExistenPuntos] = useState<boolean>(false);
  const [puntos, setPuntos] = useState<number>(0);
  const hasRunOnceAuth = useRef(false);

  const fetchCarrito = async (): Promise<{ cart: Pedido; cookieValue?: string }> => {
    const respuesta = await getOrSetCart();
    let cart = respuesta?.cart;
    let cookieValue = respuesta?.cookie;
    let aux = cart.detalles;
    return { cart, cookieValue };
  };

  useEffect(() => {
    const getCart = async () => {
      const { cart } = await fetchCarrito();
      const enrichedItems = await enrichLineItems(cart.detalles);
      cart.detalles = enrichedItems;
      setCarrito(cart); // Aquí cambié 'carrito' por 'cart'
    };
    if (carrito == null) getCart();
  }, [carrito]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`${baseUrl}/admin/producto/${id}`);
          setProduct(response.data.producto);
          // Handle the response as needed
        } catch (error) {
          console.error("Error al obtener el producto:", error);
        }

        try {
          const response = await axios.post(`${baseUrl}/admin/puntosProducto/producto`, {
            id_producto : id
          });
          if(response.data && response.data.puntosProducto && response.data.puntosProducto.cantidadPuntos) {
            setExistenPuntos(true);
            setPuntos(response.data.puntosProducto.cantidadPuntos)
          }
          // Handle the response as needed
        } catch (error) {
          console.error("Error al obtener los puntos del producto:", error);
        }
      }
    };

    fetchProduct();
  }, [id]);


  useEffect(() => {
    if(status !== "loading" && !hasRunOnceAuth.current) {
      hasRunOnceAuth.current = true;
      if (session?.user?.id) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [session, status]);

  const handleAddToCart = async () => {
    if (!product || product.inventarios[0]?.stock === 0) {
      setError("Este producto está fuera de stock.");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      if(isAuthenticated && product.promocion && product.promocion.esValido && product.promocion.limiteStock && product.promocion.limiteStock >0) {
        const responseGet = await axios.get(`${baseUrl}/admin/promocion/${product.promocion.id}`);
        if(responseGet.data.error) {
          throw new Error(responseGet.data.error)
        }
        const promoResponse = responseGet.data.promocion;
        const responseUpdate = await axios.put(`${baseUrl}/admin/promocion/${product.promocion.id}`, {limiteStock: promoResponse.limiteStock - 1});
        if(responseUpdate.data.error) {
          throw new Error(responseUpdate.data.error)
        }
        product.promocion.limiteStock = promoResponse.limiteStock - 1;
        if(product.promocion.limiteStock === 0) {
          const responseUpdate = await axios.put(`${baseUrl}/admin/promocion/${product.promocion.id}`, {esValido: false});
          if(responseUpdate.data.error) {
            throw new Error(responseUpdate.data.error)
          }
          product.promocion.esValido = false;
        }
      }

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
          idPromocion: (isAuthenticated && product.promocion && product.promocion.esValido && product.promocion.estaActivo) ? product.promocion.id : "",
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
        setCarrito(prevCarrito => ({
          ...prevCarrito,
          detalles: nuevosDetalles,
          estado: prevCarrito?.estado || "",
        }) as Pedido);
      }
      router.back();
    } catch (error) {
      console.error("Error en handleAddToCart:", error);
      setError("No se pudo añadir este producto al carrito. Por favor, inténtalo de nuevo más tarde.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBackClick = () => {
    router.push("/comprar");
  };

  if (!id) {
    return <div>Cargando...</div>;
  }

  if (!product) {
    return <div>Cargando producto...</div>;
  }

  return (
    <div className="flex justify-center items-center">
      {/* Botón de retroceso alineado con el encabezado */}
      <div style={{ position: "absolute", top: "80px", left: "250px" }}>
        <BackButton onClick={handleBackClick} />
      </div>
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
            {/*ACAAA*/}
            <p className="text-gray-700 text-lg">
            <strong>Precio: </strong> 
            {isAuthenticated && product.promocion && product.promocion.esValido && product.promocion.porcentajeDescuento ? (
              // Calculate discounted price
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "gray",
                    marginRight: "5px",
                  }}
                >
                  {"S/ " + Number(product.precioEcommerce).toFixed(2)}
                </span>
                <span style={{ color: "black" }}>
                  {"S/ " +
                    (
                      product.precioEcommerce -
                      (product.precioEcommerce * product.promocion.porcentajeDescuento) / 100
                    ).toFixed(2) + " c/u"}
                </span>
              </>
            ) : (
              // Show regular price
              <span>
                {"S/ " + Number(product.precioEcommerce).toFixed(2) + " c/u"}
              </span>
            )}
          </p>
            {
              isAuthenticated && existenPuntos && (
                <p className="text-gray-700 text-lg"><strong>Puntos Canjeables por compra de producto:</strong> {puntos}</p>
              )
            }
            {/* Botón Agregar al Carrito */}
            <button
              onClick={handleAddToCart}
              className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors duration-200"
              disabled={isAdding}
            >
              {isAdding ? "Agregando..." : "Agregar al carrito"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
