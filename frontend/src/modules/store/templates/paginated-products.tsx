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

interface Filters {
  selectedCategory?: string;
  selectedProductType?: string;
  searchText?: string;
  isSortedByPrice?: boolean | null;
}

const FILTERS_KEY = "product_filters";
const PRODUCT_LIMIT = 12;
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export default function PaginatedProducts({
  sortBy,
  page,
  countryCode,
  carrito,
  setCarrito,
  city,
  isAuthenticated,
}: {
  sortBy?: string;
  page: number;
  countryCode: string;
  carrito: Pedido | null;
  setCarrito: React.Dispatch<React.SetStateAction<Pedido | null>>;
  city?: CityCookie | null;
  isAuthenticated: boolean;
}) {
  let initialFilters: Filters = {};

  if (typeof localStorage !== 'undefined') {
    const storedFilters = localStorage.getItem(FILTERS_KEY);
    initialFilters = storedFilters ? JSON.parse(storedFilters) : {};
  }

  const [products, setProducts] = useState<Producto[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Producto[]>([]); // Guardar el estado original
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null); // Estado para el mensaje de advertencia por tiempo de espera
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilters.selectedCategory || "");
  const [categories, setCategories] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [selectedProductType, setSelectedProductType] = useState(initialFilters.selectedProductType || "");
  const [searchText, setSearchText] = useState(initialFilters.searchText || "");
  const [isSortedByPrice, setIsSortedByPrice] = useState<boolean | null>(initialFilters.isSortedByPrice ?? null);
  const [sortError, setSortError] = useState<string | null>(null); // Estado para el error de ordenación


  const saveFilters = () => {
    const filters = {
      searchText,
      selectedCategory,
      selectedProductType,
      isSortedByPrice,
    };
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  };

  useEffect(() => {
    saveFilters();
  }, [searchText, selectedCategory, selectedProductType, isSortedByPrice]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!city || city.id === "none") return;

      setLoading(true);
      setError(null);
      setWarning(null); // Restablecer la advertencia antes de la nueva solicitud

      const timeout = setTimeout(() => {
        setWarning("Parece que la conexión está lenta. Inténtalo más tarde.");
      }, 10000); // 10 segundos de tiempo de espera para mostrar la advertencia

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
        //console.log("PRODUCTOS", products); // Logs the products array
        setOriginalProducts(products); // Guardar el estado original de los productos
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
        
        clearTimeout(timeout); // Limpiar el timeout si la respuesta llega antes de los 10 segundos
      } catch (error: unknown) {
        setError(
          "Los productos no se encuentran disponibles en este momento. Por favor, inténtalo de nuevo."
        );
        clearTimeout(timeout); // Limpiar el timeout en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Polling
    const intervalId = setInterval(fetchProducts, 1200000); // Re-fetch cada dos minutos

    // Limpiar intervalo cuando se desmonta un componente
    return () => clearInterval(intervalId);
  }, [page, sortBy, city]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.toLowerCase());
  };

  // Nueva función para ordenar por precio
  const handleSortByPrice = () => {
    try {
      // Create a shallow copy of the products array to prevent direct mutation
      const sortedProducts = [...products].sort((a, b) => {
        // Calculate effective price considering promotion
        const priceA = a.promocion 
          ? a.precioEcommerce - (a.precioEcommerce * a.promocion.porcentajeDescuento) / 100
          : a.precioEcommerce;
      
        const priceB = b.promocion 
          ? b.precioEcommerce - (b.precioEcommerce * b.promocion.porcentajeDescuento) / 100
          : b.precioEcommerce;
      
        // Sort based on isSortedByPrice flag
        return isSortedByPrice ? priceA - priceB : priceB - priceA;
      });
      setProducts(sortedProducts);
      setIsSortedByPrice(isSortedByPrice === null ? true : !isSortedByPrice);
      setSortError(null);
    } catch (error) {
      // In case of an error, revert to original products and set an error message
      setProducts(originalProducts);
      setSortError("Lo sentimos. No se puede ordenar en este momento. Por favor, intenta de nuevo.");
    }
  };

  const filteredProducts = products.filter((p) => {
    // Normalize the search text to lowercase for case-insensitive matching
    const matchesSearchText = p.nombre.toLowerCase().includes(searchText);
  
    // Check category match
    const categoryMatch = selectedCategory
      ? p.subcategorias?.some((sub) => sub.nombre === selectedCategory)
      : true;
  
    // Check product type match
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
            <option value="">Todos los Sabores</option>
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
            <option value="">Todas las Presentaciones</option>
            {productTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Botón combinado de filtro y ordenación */}
          {/* Botón combinado de filtro y ordenación */}
          <button
            onClick={handleSortByPrice}
            className="flex items-center justify-center h-12 w-12 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-gray-100 focus:outline-none"
            aria-label="Ordenar y filtrar"
          >
            {isSortedByPrice !== null && (
              <FontAwesomeIcon
                icon={isSortedByPrice ? faArrowUp : faArrowDown}
                className="mr-2"
              />
            )}
            <img
              src="/images/coin.png"
              alt="Filtro"
              className="h-4 w-4" // Ajusta el tamaño según sea necesario
            />
          </button>
        </div>

        {/* Mostrar el mensaje de advertencia si la conexión es lenta */}
        {warning && (
          <div className="text-yellow-500 text-center my-4">
            {warning}
          </div>
        )}

        {/* Mostrar el mensaje de error si ocurre un fallo en la ordenación */}
        {sortError && (
          <div className="text-red-500 text-center my-4">
            {sortError}
          </div>
        )}

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
          {filteredProducts.map((p: Producto) => {
            //console.log("PRODUCTO", p);  // Logs each product object
            return (
              <li key={p.id}>
                <ProductPreview
                  productPreview={p}
                  carrito={carrito}
                  setCarrito={setCarrito}
                  isAuthenticated={isAuthenticated}
                />
              </li>
            );
          })}
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
