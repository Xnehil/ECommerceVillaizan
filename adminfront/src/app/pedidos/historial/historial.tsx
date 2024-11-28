import { DataTable } from "@/components/datatable/data-table";
import { Pedido } from "@/types/PaquetePedido";
import { MutableRefObject } from "react";
import { columns } from "./columns";

interface HistorialProps {
  historial: MutableRefObject<Pedido[]>;
}

const Historial: React.FC<HistorialProps> = ({ historial }) => {
  return (
    <div className="h-full w-full">
      <DataTable
        columns={columns}
        data={historial.current}
        nombre="pedido"
        npagination={6}
        sb={true}
        sbColumn="codigoSeguimiento"
        sbPlaceholder="Buscar por código de seguimiento"
        dd={true}
        ddColumn="estado"
        ddValues={["Entregado", "Cancelado"]}
      />
    </div>
  );
};

export default Historial;
