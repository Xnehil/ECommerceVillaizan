import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export const metadata: Metadata = {
  title: "Catálogo Villaizan",
  description: "Encuentra los mejores helados y paletas en Villaizan.",
}

type Params = {
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
  params: {
    countryCode: string
  }
}

export default async function StorePage({ searchParams, params }: Params) {
  const { sortBy, page } = searchParams
  console.log("Base URL:", baseUrl);
  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
