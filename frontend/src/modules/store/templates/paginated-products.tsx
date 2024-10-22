"use client";

import { useEffect, useState } from "react";
import ProductPreview from "@modules/products/components/product-preview";
import { Pagination } from "@modules/store/components/pagination";
import axios from "axios";
import CartButton from "@modules/layout/components/cart-button";
import { Producto } from "types/PaqueteProducto";
import { Pedido } from "types/PaquetePedido";
import { CityCookie } from "types/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faFilter } from '@fortawesome/free-solid-svg-icons';

const PRODUCT_LIMIT = 12;
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export default function PaginatedProducts({
  sortBy,
  page,
  countryCode,
  carrito,
  setCarrito,
  city,
}: {
  sortBy?: string;
  page: number;
  countryCode: string;
  carrito: Pedido | null;
  setCarrito: React.Dispatch<React.SetStateAction<Pedido | null>>;
  city?: CityCookie | null;
}) {
  const [products, setProducts] = useState<Producto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isSortedByPrice, setIsSortedByPrice] = useState<boolean | null>(null); // null si no se ha seleccionado ninguna ordenación

  useEffect(() => {
    const fetchProducts = async () => {
      if (!city || city.id === "none") return;

      setLoading(true);
      setError(null);

      try {
        const cityParam = { id_ciudad: city.id };
        const response = await axios.post(
          `${baseUrl}/admin/producto/ciudad`,
          cityParam
        );

        if (!response || !response.data || !response.data.productos) {
          throw new Error("Invalid response structure");
        }

        const products = response.data.productos;
        setProducts(products);

        const count = products.length;
        setTotalPages(Math.ceil(count / PRODUCT_LIMIT));

        const allCategories = products
          .flatMap((product: Producto) =>
            product.subcategorias?.map((sub) => sub.nombre)
          )
          .filter(Boolean);

        setCategories([...new Set<string>(allCategories)]);

        const allProductTypes = products
          .map((product: Producto) => product.tipoProducto?.nombre)
          .filter(Boolean);

        setProductTypes([...new Set<string>(allProductTypes)]);
      } catch (error: unknown) {
        setError(
          "Los productos no se encuentran disponibles en este momento. Por favor, inténtalo de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, sortBy, city]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.toLowerCase());
  };

  // Nueva función para ordenar por precio
  const handleSortByPrice = () => {
    const sortedProducts = [...products].sort((a, b) =>
      isSortedByPrice
        ? a.precioEcommerce - b.precioEcommerce // Orden ascendente si ya está en descendente
        : b.precioEcommerce - a.precioEcommerce // Orden descendente si no está ordenado
    );
    setProducts(sortedProducts);
    setIsSortedByPrice(isSortedByPrice === null ? true : !isSortedByPrice); // Cambia el estado de orden
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearchText = p.nombre.toLowerCase().includes(searchText);
    const categoryMatch = selectedCategory
      ? p.subcategorias?.some((sub) => sub.nombre === selectedCategory)
      : true;

    const productTypeMatch = selectedProductType
      ? p.tipoProducto?.nombre === selectedProductType
      : true;

    return matchesSearchText && categoryMatch && productTypeMatch;
  });

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4 items-center mb-4">
          <input
            type="text"
            placeholder="Busca tu helado"
            value={searchText}
            onChange={handleSearchChange}
            className="w-full md:w-1/3 h-12 border border-gray-300 bg-white rounded-md px-4 shadow-sm focus:outline-none focus:border-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/3 mt-4 md:mt-0 h-12 border border-gray-300 bg-white rounded-md px-4 shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Todas las Subcategorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            id="type-filter"
            value={selectedProductType}
            onChange={(e) => setSelectedProductType(e.target.value)}
            className="w-full md:w-1/3 mt-4 md:mt-0 h-12 border border-gray-300 bg-white rounded-md px-4 shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Todas las Categorías</option>
            {productTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Botón combinado de filtro y ordenación */}
          <button
            onClick={handleSortByPrice}
            className="flex items-center justify-center h-12 w-12 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-gray-100 focus:outline-none"
            aria-label="Ordenar y filtrar"
          >
            {/* Mostrar la flecha solo si se ha seleccionado alguna ordenación */}
            {isSortedByPrice !== null && (
              <FontAwesomeIcon
                icon={isSortedByPrice ? faArrowUp : faArrowDown}
                className="mr-2"
              />
            )}
            {/* Icono de filtro */}
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>

        <div className="relative z-10 mb-4">
          <CartButton carrito={carrito} setCarrito={setCarrito} />
        </div>
      </div>

      {filteredProducts.length === 0 && searchText ? (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-100 rounded-md shadow-md">
          <span className="text-red-500 text-2xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </span>
          <p className="text-gray-700 text-lg font-semibold">
            No se encontraron productos que coincidan con la búsqueda.
          </p>
        </div>
      ) : (
        <ul
          className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
          data-testid="products-list"
        >
          {filteredProducts.map((p: Producto) => (
            <li key={p.id}>
              <ProductPreview
                productPreview={p}
                carrito={carrito}
                setCarrito={setCarrito}
              />
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  );
}
