"use client";

import { useEffect, useState } from "react";
import ProductPreview from "@modules/products/components/product-preview";
import { Pagination } from "@modules/store/components/pagination";
import axios from "axios";
import { Producto } from "types/PaqueteProducto";
import { Pedido } from "types/PaquetePedido";

const PRODUCT_LIMIT = 12;
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export default function PaginatedProducts({
  sortBy,
  page,
  countryCode,
  searchText, // Recibir el texto de búsqueda
  carrito,
  setCarrito,
}: {
  sortBy?: string;
  page: number;
  countryCode: string;
  searchText: string; // Recibir el texto de búsqueda
  carrito: Pedido | null;
  setCarrito: React.Dispatch<React.SetStateAction<Pedido | null>>;
}) {
  const [products, setProducts] = useState<Producto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Nueva categoría seleccionada
  const [categories, setCategories] = useState<string[]>([]); // Lista de categorías disponibles
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [selectedProductType, setSelectedProductType] = useState("");


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/admin/producto?enriquecido=true`);
  
        if (!response || !response.data || !response.data.productos) {
          throw new Error("Invalid response structure");
        }
  
        const products = response.data.productos;
        setProducts(products);
  
        const count = products.length;
        setTotalPages(Math.ceil(count / PRODUCT_LIMIT));
  
        // Obtener subcategorías y tipos de producto y actualizar el estado
        const allCategories = products
          .flatMap((product: Producto) =>
            product.subcategorias?.map((sub) => sub.nombre)
          )
          .filter(Boolean);
  
        setCategories([...new Set<string>(allCategories)]); // Quitar duplicados
  
        // Obtener todos los tipos de producto y actualizar el estado
        const allProductTypes = products
          .map((product: Producto) => product.tipoProducto?.nombre)
          .filter(Boolean);
  
        setProductTypes([...new Set<string>(allProductTypes)]); // Quitar duplicados
  
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error fetching products:",
            error.response ? error.response.data : error.message
          );
        } else {
          console.error("Error fetching products:", error);
        }
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [page, sortBy]);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filtrar los productos según la categoría seleccionada
  const filteredProducts = products.filter((p) => {
    // Filtrar por subcategoría si está seleccionada
    const categoryMatch = selectedCategory
      ? p.subcategorias.some((sub) => sub.nombre === selectedCategory)
      : true;
  
    // Filtrar por tipo de producto si está seleccionado
    const productTypeMatch = selectedProductType
      ? p.tipoProducto?.nombre === selectedProductType
      : true;
  
    // Solo devolver los productos que coincidan con ambos filtros
    return categoryMatch && productTypeMatch;
  });

  // Mostrar mensaje de "No se encontraron productos" cuando no haya coincidencias
  if (filteredProducts.length === 0 && searchText) {
    return (
      <div className="flex flex-col items-center justify-center py-8 bg-gray-100 rounded-md shadow-md">
        <span className="text-red-500 text-2xl mb-4">
          <i className="fas fa-exclamation-circle"></i>
        </span>
        <p className="text-gray-700 text-lg font-semibold">
          No se encontraron productos que coincidan con la búsqueda.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Filtro de categorías */}
      <div className="mb-4">
        <label className="block mb-2 text-lg font-semibold">Filtrar por Subcategoría:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="">Todas las Subcategorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="type-filter">Filtrar por Tipo de Producto:</label>
        <select
          id="type-filter"
          value={selectedProductType}
          onChange={(e) => setSelectedProductType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos los Tipos</option>
          {productTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>   
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {filteredProducts.map((p: Producto) => (
          <li key={p.id}>
            <ProductPreview productPreview={p} carrito={carrito} setCarrito={setCarrito} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination data-testid="product-pagination" page={page} totalPages={totalPages} />
      )}
    </>
  );
}
