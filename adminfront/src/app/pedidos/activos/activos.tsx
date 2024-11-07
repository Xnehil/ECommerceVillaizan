import { DataTable } from "@/components/datatable/data-table";
import { Pedido } from "@/types/PaquetePedido";
import { MutableRefObject } from "react";
import { columns } from "./columns";

interface ActivosProps {
  activos: MutableRefObject<Pedido[]>;
}

const Activos: React.FC<ActivosProps> = ({ activos }) => {
  return (
    <div className="h-full w-full">
      <DataTable
        columns={columns}
        data={activos.current}
        nombre="pedido"
        npagination={6}
        sb={true}
        sbColumn="id"
        sbPlaceholder="Buscar por código de seguimiento"
        dd={true}
        ddColumn="estado"
        ddValues={["Verificado", "En Progreso"]}
      />
    </div>
  );
};

export default Activos;
