"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Pedido } from "types/PaquetePedido";

const baseUrl = "http://localhost:9000";

export default function Historial() {
  const { data: session } = useSession();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [modalData, setModalData] = useState<Pedido | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPedidos = async () => {
    if (session?.user?.id) {
      setIsLoading(true);
      setError(false);
      try {
        const response = await axios.get(`${baseUrl}/admin/pedido/usuario`, {
          params: { id: session.user.id },
        });
        const pedidosConCodigo = response.data.pedidos
          .filter((pedido: Pedido) => pedido.codigoSeguimiento !== null)
          .sort((a: Pedido, b: Pedido) => new Date(b.creadoEn!).getTime() - new Date(a.creadoEn!).getTime());
        setPedidos(pedidosConCodigo);
      } catch (error) {
        console.error("Error fetching pedidos:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [session]);

  const fetchPedidoDetails = async (pedidoId: string) => {
    try {
      const response = await axios.get(`${baseUrl}/admin/pedido/${pedidoId}`);
      setModalData(response.data.pedido);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching pedido details:", error);
    }
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) + ' ' + date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  return (
    <div>
      {/* Banner */}
      <img
        src="/images/bannerFlujoCompra.png"
        alt="Promociones en Villaizan"
        style={{
          width: "100%",
          height: "20vh",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Historial de Pedidos */}
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-black-700">Historial de Pedidos</h2>

        {isLoading ? (
          <p className="text-center text-gray-500">Cargando historial de pedidos...</p>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500">Hubo un error al cargar el historial de pedidos.</p>
            <button
              onClick={fetchPedidos}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : pedidos.length > 0 ? (
          <ul className="space-y-4">
            {pedidos.map((pedido) => (
              <li key={pedido.id} className="border border-gray-200 p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-800">
                    Código de Pedido: {pedido.codigoSeguimiento}
                  </span>
                  <span className="text-sm text-gray-500">
                    {pedido.creadoEn ? formatFecha(pedido.creadoEn as unknown as string) : "Fecha no disponible"}
                  </span>
                </div>
                <p className="text-gray-700"><strong>Estado:</strong> {pedido.estado}</p>
                <p className="text-gray-700"><strong>Total:</strong> S/ {pedido.total}</p>
                <button
                  onClick={() => fetchPedidoDetails(pedido.id)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Ver Detalle
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No tienes pedidos en tu historial.</p>
        )}

        {/* Modal de Detalles del Pedido */}
        {isModalOpen && modalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Detalles del Pedido</h2>
              <p><strong>Fecha del pedido:</strong> {formatFecha(modalData.creadoEn as unknown as string)}</p>
              <p><strong>Estado del pedido:</strong> {modalData.estado}</p>
              <p><strong>Monto total pagado:</strong> S/ {modalData.total}</p>
              <p><strong>Método de pago:</strong> {modalData.metodoPago || "No especificado"}</p>
              <p><strong>Dirección de entrega:</strong> {modalData.direccion?.calle || "No disponible"} {modalData.direccion?.numeroExterior || ""}</p>
              <h3 className="font-bold mt-4 mb-2">Productos:</h3>
              <ul className="list-disc pl-5">
                {modalData.detalles.map((detalle: any) => (
                  <li key={detalle.id}>
                    {detalle.cantidad} x Producto (S/ {detalle.subtotal})
                  </li>
                ))}
              </ul>
              <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
