import { LineItem, Region } from "@medusajs/medusa"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import axios from "axios"
import { useEffect, useState } from "react"
import { DetallePedido, Pedido } from "types/PaquetePedido"

type ItemsTemplateProps = {
  carrito: Pedido
  setCarrito: (carrito: Pedido) => void
  isAuthenticated: boolean
}

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const ItemsTemplate = ({  carrito, setCarrito, isAuthenticated }: ItemsTemplateProps) => {
  const [refresh, setRefresh] = useState(false);
  const [items, setItems] = useState(carrito.detalles || []);


  const deleteItem = (itemId:string) => {
    const updatedItems = items.filter(item => item.id !== itemId);

    setCarrito({...carrito, detalles: updatedItems});
    setItems(updatedItems);
    setRefresh(!refresh); 
  };

  const onChangePromo = async () => {
    try {
      const updatedItems = await Promise.all(items.map(async item => {
        // Update the promo for each item
        if (item.promocion !== null && item.promocion !== undefined && item.promocion.esValido === true) {
          const response = await axios.get(`${baseUrl}/admin/promocion/${item.promocion.id}`);
          const promo = response.data.promocion;
          return {
            ...item,
            promocion: promo
          };
        } else {
          return item;
        }
      }));
  
      // Update the state with the new items
      setItems(updatedItems);
  
      // Refresh the component
      setRefresh(!refresh);
    } catch (e) {
      console.error(e);
    }
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
                  return <Item key={item.id} item={item} onDelete = {() =>  deleteItem(item.id)} isAuthenticated={isAuthenticated} onChangePromo={() => onChangePromo()} items={items} setItems={setItems} />
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
