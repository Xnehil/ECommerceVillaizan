import { LineItem, Region } from "@medusajs/medusa"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { useEffect, useState } from "react"
import { DetallePedido, Pedido } from "types/PaquetePedido"

type ItemsTemplateProps = {
  carrito: Pedido
  setCarrito: (carrito: Pedido) => void
  isAuthenticated: boolean
}

const ItemsTemplate = ({  carrito, setCarrito, isAuthenticated }: ItemsTemplateProps) => {
  const [refresh, setRefresh] = useState(false);
  const [items, setItems] = useState(carrito.detalles || []);


  const deleteItem = (itemId:string) => {
    // Your deletion logic here
    const updatedItems = items.filter(item => item.id !== itemId);
    //Refresh carrito so the other components can update
    setCarrito({...carrito, detalles: updatedItems});

    setItems(updatedItems);
    setRefresh(!refresh); 
  };

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">Carrito de Compras</Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0 bg-cremaFondo" >
          <Table.Row className="bg-cremaFondo txt-medium-plus text-black text-base font-medium font-poppins p-2">
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell className="pl-1">Producto</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Precio
            </Table.HeaderCell>
            <Table.HeaderCell className="text-center">Cantidad</Table.HeaderCell>
            <Table.HeaderCell className="pr-1 text-right">
              Subtotal
            </Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.creadoEn ?? 0) > (b.creadoEn ?? 0) ? -1 : 1
                })
                .map((item) => {
                  return <Item key={item.id} item={item} onDelete = {() =>  deleteItem(item.id)} isAuthenticated={isAuthenticated} />
                })
            : Array.from(Array(5).keys()).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
