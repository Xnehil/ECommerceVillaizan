import { DataTable } from "@/components/datatable/data-table";
import { Pedido } from "@/types/PaquetePedido";
import { MutableRefObject } from "react";
import { columns } from "./columns";

interface PendientesProps {
  pendientes: MutableRefObject<Pedido[]>;
}

const Pendientes: React.FC<PendientesProps> = ({ pendientes }) => {
  return (
    <div className="h-full w-full">
      <DataTable columns={columns} data={pendientes.current} nombre="pedido" npagination={7} />
    </div>
  );
};

export default Pendientes;
