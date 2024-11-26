"use client"

import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
import { addToCart } from "@modules/cart/actions"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/option-select"

import MobileActions from "../mobile-actions"
import ProductPrice from "../product-price"
import { Producto } from "types/PaqueteProducto"
import { useSession } from "next-auth/react"
import axios from "axios"

type ProductActionsProps = {
  product: Producto
  region?: Region
  disabled?: boolean
}

export type PriceType = {
  calculated_price: string
  original_price?: string
  price_type?: "sale" | "default"
  percentage_diff?: string
}

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const hasRunOnceAuth = useRef(false);

  const countryCode = useParams().countryCode as string


  // // initialize the option state
  // useEffect(() => {
  //   const optionObj: Record<string, string> = {}

  //   for (const option of product.options || []) {
  //     Object.assign(optionObj, { [option.id]: undefined })
  //   }

  //   setOptions(optionObj)
  // }, [product])

  // // memoized record of the product's variants
  // const variantRecord = useMemo(() => {
  //   const map: Record<string, Record<string, string>> = {}

  //   for (const variant of variants) {
  //     if (!variant.options || !variant.id) continue

  //     const temp: Record<string, string> = {}

  //     for (const option of variant.options) {
  //       temp[option.option_id] = option.value
  //     }

  //     map[variant.id] = temp
  //   }

  //   return map
  // }, [variants])

  // memoized function to check if the current options are a valid variant
  // const variant = useMemo(() => {
  //   let variantId: string | undefined = undefined

  //   for (const key of Object.keys(variantRecord)) {
  //     if (isEqual(variantRecord[key], options)) {
  //       variantId = key
  //     }
  //   }

  //   return variants.find((v) => v.id === variantId)
  // }, [options, variantRecord, variants])

  // // if product only has one variant, then select it
  // useEffect(() => {
  //   if (variants.length === 1 && variants[0].id) {
  //     setOptions(variantRecord[variants[0].id])
  //   }
  // }, [variants, variantRecord])

  // // update the options when a variant is selected
  // const updateOptions = (update: Record<string, string>) => {
  //   setOptions({ ...options, ...update })
  // }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    // if (variant && !variant.manage_inventory) {
    //   return true
    // }

    // // If we allow back orders on the variant, we can add to cart
    // if (variant && variant.allow_backorder) {
    //   return true
    // }

    // // If there is inventory available, we can add to cart
    // if (variant?.inventory_quantity && variant.inventory_quantity > 0) {
    //   return true
    // }

    // Otherwise, we can't add to cart
    return true
  }, [product])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    try{
      if (!product?.id) return null

      setIsAdding(true)

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

      await addToCart({
        cantidad: 1,
        idProducto: product.id || "",
        precio:  product.precioEcommerce
      })

 
    }
    catch(e) {
      console.error(e);
      
    }
    finally {
      setIsAdding(false)
    }

    
  }

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

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {product  && (
            <div className="flex flex-col gap-y-4">
              {/* {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })} */}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product}  region={region} />

        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !!disabled || isAdding}
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!product
            ? "Elegir variantes"
            : !inStock
            ? "Fuera de stock"
            : "Añadir al carrito"}
        </Button>
        <MobileActions
          product={product}
          region={region}
          options={options}
          // updateOptions={updateOptions}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
