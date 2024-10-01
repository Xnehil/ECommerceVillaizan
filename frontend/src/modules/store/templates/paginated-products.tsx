import { getProductsListWithSort, getRegion } from "@lib/data"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import axios from "axios"
import { Producto } from "types/PaqueteProducto"

const PRODUCT_LIMIT = 12
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  try {
    const response = await axios.get(
      `${baseUrl}/admin/producto`,
      {
        // params: {
        //   ...queryParams,
        //   sort: sortBy,
        //   page,
        // },
      }
    );
  

    console.log('API Response:', response);

    if (!response || !response.data || !response.data.productos) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response structure');
    }
  
  const products  = response.data.productos
  const count  = products.length
  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8" data-testid="products-list">
        {products.map((p:Producto) => {
          return (
            <li key={p.id}>
              <ProductPreview productPreview={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && <Pagination data-testid="product-pagination" page={page} totalPages={totalPages} />}
    </>
  );
} catch (error) {
  console.error('Error fetching products:', error);
  return <div>Error fetching products</div>;
}
}
