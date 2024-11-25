"use client"

import { Region } from "@medusajs/medusa"
import { DetallePedido, Pedido } from "types/PaquetePedido"
import { Table, clx } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: Omit<DetallePedido, "beforeInsert">[]
  region?: Region
}

const ItemsPreviewTemplate = ({ items, region }: ItemsTemplateProps) => {
  const hasOverflow = items && items.length > 4
  const deleteItem = (itemId:string) => {
    // Your deletion logic here
    
  };

  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      <Table>
        <Table.Body data-testid="items-table">
          {items && region
            ? items
                /*.sort((a, b) => {
                  return a.created_at > b.created_at ? -1 : 1
                })*/
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      onDelete = {() =>  deleteItem(item.id)}
                      isAuthenticated={false}
                    />
                  )
                })
            : Array.from(Array(5).keys()).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsPreviewTemplate