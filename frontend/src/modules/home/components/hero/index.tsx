import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import CartButton from "@modules/layout/components/cart-button"
import Link from "next/link"
import { Suspense } from "react"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            Helados Villaizan
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal mb-4"
          >
            El papá de las paletas
          </Heading>
          <Suspense
              fallback={
                <Link
                // border-radius: var(--spacing-2-5, 10px);
                  className="hover:text-ui-fg-base flex gap-2 items-center"
                  style={{ color: "#FFFEFE", fontFamily: "Inter", fontSize: "32px", fontStyle: "normal", fontWeight: 700, lineHeight: "normal" }}
                  href="/cart"
                >
                  Comprar
                </Link>
              }
            >
              {/*<CartButton />*/}
            </Suspense>
        </span>
      </div>
    </div>
  )
}

export default Hero
