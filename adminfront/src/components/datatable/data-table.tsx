"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  nombre?: string;
  npagination?: number;
  pl?: boolean;
  checkLeido?: boolean;
  sb?: boolean;
  sbPlaceholder?: string;
  sbColumn?: string;
  dd?: boolean;
  ddColumn?: string;
  ddValues?: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  nombre,
  npagination,
  pl = false,
  checkLeido = false,
  sb = false,
  sbPlaceholder,
  sbColumn,
  dd = false,
  ddColumn,
  ddValues,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: npagination || 7,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      columnFilters,
    },
  });

  return (
    <div>
      {(sb || dd) && (
        <div className="flex items-center py-4">
          {sb && sbColumn && (
            <Input
              placeholder={sbPlaceholder}
              value={
                (table.getColumn(sbColumn)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(sbColumn)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}
          {dd && ddColumn && (ddValues?.length ?? 0) > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {String(
                    table.getColumn(ddColumn)?.getFilterValue() ||
                      ddColumn.charAt(0).toUpperCase() + ddColumn.slice(1)
                  )}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {ddValues?.map((value) => (
                  <DropdownMenuCheckboxItem
                    key={value}
                    className="capitalize"
                    checked={
                      table.getColumn(ddColumn)?.getFilterValue() === value
                    }
                    onCheckedChange={(checked) => {
                      table
                        .getColumn(ddColumn)
                        ?.setFilterValue(checked ? value : undefined);
                    }}
                  >
                    {value}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    checkLeido
                      ? row.original.leido
                        ? ""
                        : "bg-blue-50 font-semibold"
                      : ""
                  }
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay contenido para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        {" "}
        <span className="flex items-center gap-1 text-sm">
          <strong>{table.getRowModel().rows.length}</strong>
          <div>de</div>
          <strong>{table.getPrePaginationRowModel().rows.length}</strong>
          <div>
            {nombre}({pl ? "es" : "s"})
          </div>
        </span>
        <div className="flex items-center justify-end space-x-2">
          {table.getCanPreviousPage() && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
          )}
          {table.getCanNextPage() && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
