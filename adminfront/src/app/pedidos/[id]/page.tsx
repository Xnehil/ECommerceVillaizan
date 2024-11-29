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
          `${process.env.NEXT_PUBLIC_BASE_URL}pedido/${idPedido}`
        );
        if (!response) {
          throw new Error("Failed to fetch pedido");
        }
        const data = await response.data;
        console.log("Pedido fetched:", data);

        const productData: Pedido = data.pedido;

        pedido.current = productData;

        console.log("Pedido:", pedido.current);
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
    setIsLoading(true);
    console.log("Confirmando pedido");
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}pedido/${pedido.current.id}`,
        {
          ...pedido.current,
          estado: "verificado",
        }
      );
      if (response.status !== 200) {
        throw new Error("Error al actualizar el pedido");
      }
      console.log("Pedido saved", response.data);
      pedido.current.estado = "verificado";

      try {
        const respMssg = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}whatsApp`,
          {
            mensaje: `🍦 *Helados Villaizan* 🍦\n\n¡Hola!\nTu pedido ha sido confirmado y está en camino. 🎉\n\n📦 *Código de seguimiento:* ${pedido.current.codigoSeguimiento}\n\nPara conocer el estado de tu pedido en tiempo real, ingresa al siguiente enlace: ${process.env.ECOMMERCE_URL}/seguimiento?codigo=${pedido.current.codigoSeguimiento} o visita nuestro sitio web y usa tu código en la sección 'Rastrea tu pedido'.\n\nSi tienes alguna consulta, ¡estamos aquí para ayudarte! 😊`,
            numero: pedido.current.usuario?.numeroTelefono,
          }
        );
        console.log("Respuesta de WhatsApp:", respMssg);
        if (respMssg.status !== 201) {
          throw new Error("Error al enviar mensaje de WhatsApp");
        }
        console.log("Mensaje enviado a WhatsApp.");
      } catch (error) {
        console.error("Error sending WhatsApp message", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al enviar el mensaje de WhatsApp.",
        });
      }

      setIsLoading(false);
      toast({
        description: "Se confirmó el pedido correctamente.",
      });
    } catch (error: any) {
      console.error("Error saving product", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al confirmar el pedido.",
      });
    }
  };

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    console.log("Confirmando pago");
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      const responsePagoConfirmado = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}pedido/pagoConfirmado`,
        { id: pedido.current.id }
      );

      if (responsePagoConfirmado.status !== 200) {
        throw new Error("Error al realizar el flujo de pago confirmado");
      }

      console.log("Pedido saved", responsePagoConfirmado.data);
      pedido.current.pagado = true;

      setIsLoading(false);
      toast({
        description: "Se confirmó el pago correctamente.",
      });
    } catch (error: any) {
      console.error("Error saving product", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al confirmar el pago.",
      });
    }
  };

  const handleConfirmEntregado = async () => {
    setIsLoading(true);
    console.log("Marcando como entregado");
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      const responseEntregado = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}pedido/${pedido.current.id}`,
        {
          ...pedido.current,
          estado: "entregado",
        }
      );

      if (responseEntregado.status !== 200) {
        throw new Error("Error al marcar como entregado");
      }

      console.log("Pedido saved", responseEntregado.data);
      pedido.current.estado = "entregado";

      setIsLoading(false);
      toast({
        description: "Se marcó como entregado correctamente.",
      });
    } catch (error: any) {
      console.error("Error saving product", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al marcar como entregado.",
      });
    }
  };

  const handleConfirmCancelado = async () => {
    setIsLoading(true);
    // console.log("Marcando como cancelado");
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      const responseCancelado = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}pedido/${pedido.current.id}`,
        {
          ...pedido.current,
          estado: "cancelado",
        }
      );

      if (responseCancelado.status !== 200) {
        throw new Error("Error al marcar como cancelado");
      }

      console.log("Pedido saved", responseCancelado.data);
      pedido.current.estado = "cancelado";

      setIsLoading(false);
      toast({
        description: "Se marcó como cancelado correctamente.",
      });
    } catch (error: any) {
      console.error("Error saving product", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al marcar como cancelado.",
      });
    }
  };

  const handleConfirmFraudulento = async () => {
    setIsLoading(true);
    // console.log("Marcando como cancelado");
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      const responseCancelado = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}pedido/${pedido.current.id}`,
        {
          ...pedido.current,
          estado: "fraudulento",
        }
      );

      if (responseCancelado.status !== 200) {
        throw new Error("Error al marcar como fraudulento");
      }

      console.log("Pedido saved", responseCancelado.data);
      pedido.current.estado = "fraudulento";

      setIsLoading(false);
      toast({
        description: "Se marcó como fraudulento correctamente.",
      });
    } catch (error: any) {
      console.error("Error saving product", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al marcar como fraudulento.",
      });
    }
  };

  return (
    <div className="content-container">
      {isLoading && <Loading />}

      {!isLoading && pedido.current?.id && (
        <>
          <h4>{pedido.current.codigoSeguimiento}</h4>
          <Separator />
          <div className="information-container">
            <InformacionPedido pedido={pedido} />
            <InformacionCliente pedido={pedido} />
            <InformacionDireccion pedido={pedido} />
          </div>
          <div className="buttons-side-container">
            {pedido.current.estado === "solicitado" && (
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
            )}
            {pedido.current.estado === "entregado" &&
              !pedido.current.pagado && (
                <div className="lower-buttons-container">
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          Marcar como fraudulento
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Estás seguro de marcar como fraudulento este
                            pedido?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            El pedido será marcado como fraudulento. Esta acción
                            no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Regresar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleConfirmFraudulento}>
                            Marcar como fraudulento
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="default">Confirmar Pago</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Estás seguro de confirmar el pago?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            El pago de este pedido será confirmado. Asegúrate de
                            que los datos sean correctos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleConfirmPayment}>
                            Confirmar Pago
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                </div>
              )}
            {pedido.current.estado === "manual" && (
              <div className="lower-buttons-container">
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Cancelado</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Estás seguro de marcar como cancelado este pedido?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          El pedido será marcado como cancelado. Esta acción no
                          se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Regresar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCancelado}>
                          Marcar como cancelado
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default">Entregado</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Estás seguro de marcar como entregado este pedido?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          El pedido será marcado como entregado. Esta acción no
                          se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmEntregado}>
                          Marcar como entregado
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PedidoPage;
