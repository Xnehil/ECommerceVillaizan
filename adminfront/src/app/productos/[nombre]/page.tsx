"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/styles/general.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import InformacionGeneral from "../agregar/informacionGeneral";
import InformacionAdicional from "../agregar/informacionAdicional";
import { Input } from "@/components/ui/input";
import { Producto } from "@/types/PaqueteProducto";
import axios from "axios";
import Loading from "@/components/Loading";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductoPageProps {
  params: {
    nombre: string;
  };
}

const ProductoPage: React.FC<ProductoPageProps> = ({ params: { nombre } }) => {
  const searchParams = useSearchParams();
  const [productName, setProductName] = useState<string | string[]>(
    decodeURIComponent(nombre)
  );
  const [isLoading, setIsLoading] = useState(true);
  const producto = useRef<Producto>({} as Producto);
  const copyProducto = useRef<Producto>({} as Producto);
  const [isEditing, setIsEditing] = useState(false);
  const imagen = useRef<File | undefined>(undefined);
  const a = useRef(0);

  // useEffect(() => {
  //   const edit = searchParams.get("edit");
  //   if (edit === "true") {
  //     setIsEditing(true);
  //   }
  // }, [searchParams]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchProductByNombre = async () => {
      if (producto.current.id) return;

      try {
        // console.log("Fetching categories");
        // console.log(a.current);
        a.current = a.current + 1;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}producto/${nombre}?nombre=true&enriquecido=true`
        );
        if (!response) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.data;
        console.log("Product fetched:", data);

        const productData: Producto = data.producto;

        producto.current = productData;

        console.log("Product:", producto.current);

        const edit = searchParams.get("edit");
        if (edit === "true") {
          handleEdit();
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (a.current === 0) {
      fetchProductByNombre();
    }
  }, []);

  const handleCancel = () => {
    copyProducto.current = { id: "a" } as Producto;
    setProductName(producto.current.nombre);
    setIsEditing(false);
    // router.back();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^[a-zA-Z0-9\s]*$/;

    if (!regex.test(value)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre del producto no puede contener puntuación.",
      });
      return;
    }
    
    if (value.length <= 50) {
      setProductName(value);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "El nombre del producto no puede tener más de 50 caracteres.",
      });
    }
    // producto.current.nombre = event.target.value;
  };

  const handleSave = async () => {
    setIsLoading(true);
    console.log("Saving product");
    copyProducto.current.nombre = productName as string;
    // create a codigo for the product
    producto.current.seVendeEcommerce = true;

    document.body.style.pointerEvents = "auto";

    if (copyProducto.current.nombre === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre del producto es requerido.",
      });
      return;
    } else if (copyProducto.current.nombre.length < 3) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre del producto debe tener al menos 3 caracteres.",
      });
      return;
    }

    if (copyProducto.current.precioEcommerce === 0) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El precio del producto es requerido.",
      });
      return;
    }

    

    console.log(copyProducto.current);
    try {
      if (imagen.current) {
        const formData = new FormData();
        formData.append("file", imagen.current);
        formData.append("fileName", imagen.current.name);
        formData.append("folderId", "productos");
        

        const responseImagen = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}imagenes`,
          formData
        );
        console.log(responseImagen);
        if (responseImagen.status !== 200) {
          throw new Error("Error al guardar imagen.");
        }
        copyProducto.current.urlImagen = responseImagen.data.fileUrl;
      }
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}producto/${producto.current.id}`,
        copyProducto.current
      );
      if (response.status !== 200) {
        throw new Error("Error al guardar producto.");
      }
      console.log("Product saved", response.data);
      producto.current = copyProducto.current;
      setIsEditing(false);

      setIsLoading(false);

      toast({
        description: "El producto se guardó correctamente.",
      });
    } catch (error: any) {
      console.error("Error saving product", error);
      setIsLoading(false);

      let description =
        "Ocurrió un error al guardar el producto. Por favor, intente de nuevo.";
      if (
        error?.response?.data?.error &&
        error.response.data.error.includes("ya existe")
      ) {
        description = error.response.data.error;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description,
      });
    }
  };

  const handleEdit = () => {
    copyProducto.current = { ...producto.current };
    setIsEditing(true);
  };

  return (
    <div className="content-container">
      {isLoading && <Loading />}
      {producto.current?.id && (
        <>
          <div className="flex flex-row items-center space-x-2">
            <>
              {isEditing ? (
                <>
                  <Label>
                    Nombre<span className="text-red-500">*</span>{" "}
                  </Label>
                  <Input
                    value={productName}
                    placeholder={"Nombre del producto"}
                    onChange={handleInputChange}
                    // onBlur={handleInputBlur}
                  />
                </>
              ) : (
                <h4>
                  {
                    productName
                    // != "" ? productName : "Nombre del producto"
                  }
                </h4>
              )}
              {/* {isEditing && <span className="text-red-500">*</span>} */}
            </>
            {/* {isEditing && (
          <Image
            src="/icons/edit.png"
            alt="Edit Icon"
            width={20}
            height={20}
            className="inline-block cursor-pointer"
            onClick={handleEditClick}
          />
        )} */}
          </div>
          <Separator />
          <div className="information-container">
            <InformacionGeneral
              producto={isEditing ? copyProducto : producto}
              isEditing={isEditing}
              imagen={imagen}
            />
            <InformacionAdicional
              producto={isEditing ? copyProducto : producto}
              isEditing={isEditing}
            />
            <div className="buttons-side-container">
              <div className="lower-buttons-container">
                {isEditing ? (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary">Cancelar</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>¿Estás seguro de cancelar?</DialogTitle>
                          <DialogDescription>
                            Se perderán los cambios realizados.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button onClick={handleCancel}>Confirmar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="default">Guardar</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Estás seguro de guardar?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Se guardarán los cambios realizados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSave}>
                            Guardar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <Button variant="default" onClick={handleEdit}>
                    Editar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductoPage;
