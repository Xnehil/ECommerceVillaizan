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
        npagination={7}
      />
    </div>
  );
};

export default Historial;
