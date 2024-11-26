import { DataTable } from "@/components/datatable/data-table";
import { Pedido } from "@/types/PaquetePedido";
import { MutableRefObject } from "react";
import { columns } from "./columns";

interface ManualProps {
  manual: MutableRefObject<Pedido[]>;
}

const Manual: React.FC<ManualProps> = ({ manual }) => {
  return (
    <div className="h-full w-full">
      <DataTable
        columns={columns}
        data={manual.current}
        nombre="pedido"
        npagination={6}
        sb={true}
        sbColumn="id"
        sbPlaceholder="Buscar por código de seguimiento"
        dd={true}
      />
    </div>
  );
};

export default Manual;
