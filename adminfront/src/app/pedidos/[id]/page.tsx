"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/styles/general.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Loading from "@/components/Loading";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pedido } from "@/types/PaquetePedido";
import InformacionCliente from "@/app/pedidos/[id]/informacionCliente";
import InformacionDireccion from "@/app/pedidos/[id]/informacionDireccion";
import InformacionPedido from "@/app/pedidos/[id]/informacionPedido";

interface PedidoPageProps {
  params: {
    id: string;
  };
}

const PedidoPage: React.FC<PedidoPageProps> = ({ params: { id } }) => {
  const searchParams = useSearchParams();
  const [idPedido, setIdPedido] = useState<string | string[]>(
    decodeURIComponent(id)
  );
  const [isLoading, setIsLoading] = useState(true);
  const pedido = useRef<Pedido>({} as Pedido);
  const a = useRef(0);

  const { toast } = useToast();

  useEffect(() => {
    const fetchProductByNombre = async () => {
      if (pedido.current.id) return;

      try {
        // console.log("Fetching categories");
        // console.log(a.current);
        a.current = a.current + 1;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}pedido/${idPedido}/conDetalle`
        );
        if (!response) {
          throw new Error("Failed to fetch pedido");
        }
        const data = await response.data;
        console.log("Pedido fetched:", data);

        const productData: Pedido = data.pedido;

        pedido.current = productData;

        console.log("Pedido:", pedido.current);

        const edit = searchParams.get("edit");
        if (edit === "true") {
        //   handleEdit();
        }
      } catch (error) {
        console.error("Error fetching pedido:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al cargar el pedido.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (a.current === 0) {
      fetchProductByNombre();
    }
  }, []);

  const handleSave = async () => {
    // setIsLoading(true);
    // console.log("Saving product");
    // // copyProducto.current.nombre = productName as string;
    // // create a codigo for the product
    // producto.current.seVendeEcommerce = true;
    // document.body.style.pointerEvents = "auto";
    // if (copyProducto.current.nombre === "") {
    //   setIsLoading(false);
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "El nombre del producto es requerido.",
    //   });
    //   return;
    // } else if (copyProducto.current.nombre.length < 3) {
    //   setIsLoading(false);
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "El nombre del producto debe tener al menos 3 caracteres.",
    //   });
    //   return;
    // }
    // if (copyProducto.current.precioEcommerce === 0) {
    //   setIsLoading(false);
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "El precio del producto es requerido.",
    //   });
    //   return;
    // }
    // console.log(copyProducto.current);
    // try {
    //   if (imagen.current) {
    //     const formData = new FormData();
    //     formData.append("file", imagen.current);
    //     formData.append("fileName", imagen.current.name);
    //     formData.append("folderId", "productos");
    //     const responseImagen = await axios.post(
    //       `${process.env.NEXT_PUBLIC_BASE_URL}imagenes`,
    //       formData
    //     );
    //     console.log(responseImagen);
    //     if (responseImagen.status !== 200) {
    //       throw new Error("Error al guardar imagen.");
    //     }
    //     copyProducto.current.urlImagen = responseImagen.data.fileUrl;
    //   }
    //   // await new Promise((resolve) => setTimeout(resolve, 3000));
    //   const response = await axios.put(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}producto/${producto.current.id}`,
    //     copyProducto.current
    //   );
    //   if (response.status !== 200) {
    //     throw new Error("Error al guardar producto.");
    //   }
    //   console.log("Product saved", response.data);
    //   producto.current = copyProducto.current;
    //   setIsEditing(false);
    //   setIsLoading(false);
    //   toast({
    //     description: "El producto se guardó correctamente.",
    //   });
    // } catch (error: any) {
    //   console.error("Error saving product", error);
    //   setIsLoading(false);
    //   let description =
    //     "Ocurrió un error al guardar el producto. Por favor, intente de nuevo.";
    //   if (
    //     error?.response?.data?.error &&
    //     error.response.data.error.includes("ya existe")
    //   ) {
    //     description = error.response.data.error;
    //   }
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description,
    //   });
    // }
  };

  return (
    <div className="content-container">
      {isLoading && <Loading />}

      <h4>{idPedido}</h4>
      <Separator />
      {pedido.current?.id && (
        <>
          <div className="information-container">
            <InformacionPedido pedido={pedido} />
            <InformacionCliente pedido={pedido} />
            <InformacionDireccion pedido={pedido} />
          </div>
          <div className="buttons-side-container">
            <div className="lower-buttons-container">
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default">Confirmar Pedido</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Estás seguro de confirmar el pedido?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Este pedido será atendido, asegúrate de que la
                        información sea correcta.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSave}>
                        Confirmar Pedido
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PedidoPage;
