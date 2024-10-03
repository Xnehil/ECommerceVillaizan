import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import axios from "axios"
import { Producto } from "types/PaqueteProducto"

const PRODUCT_LIMIT = 12
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: string
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  console.log("PaginatedProducts component loaded");
  try {
    console.log("Base URL:", baseUrl);
    console.log("Fetching products from API...");
  
    const response = await axios.get(`${baseUrl}/admin/producto`);
  
    console.log("API response:", response);  // Verifica la respuesta de la API
  
    if (!response || !response.data || !response.data.productos) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response structure');
    }
  
    const products = response.data.productos;
    const count = products.length;
    const totalPages = Math.ceil(count / PRODUCT_LIMIT);
  
    return (
      <>
        <ul className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8" data-testid="products-list">
          {products.map((p: Producto) => (
            <li key={p.id}>
              <ProductPreview productPreview={p} />
            </li>
          ))}
        </ul>
        {totalPages > 1 && <Pagination data-testid="product-pagination" page={page} totalPages={totalPages} />}
      </>
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log('Error fetching products:', error.response ? error.response.data : error.message);
    } else {
      console.log('Error fetching products:', error);
    }
    return <div>aaaaaaaaaaaaaaaaaa</div>;
  }
  
}
