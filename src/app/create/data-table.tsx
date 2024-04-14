"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import SidebarCardEdit from "./sidebar-card-edit";
import { type Card } from "~/types/cards";
import { Sheet, SheetTrigger } from "~/components/ui/sheet";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable({ columns, data }: DataTableProps<Card>) {
  // TODO make this a searchParam
  const [focusCard, setFocusCard] = useState<Card | undefined>();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    console.log({ focusCard });
  }, [focusCard]);

  return (
    <div className="max-w-[90vw] rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead></TableHead>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, i) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className=""
              >
                <TableCell>{i + 1}</TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell>
                  <Sheet
                    open={
                      focusCard !== undefined &&
                      focusCard.id === row.original.id
                    }
                    onOpenChange={(open) => !open && setFocusCard(undefined)}
                  >
                    <SheetTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => {
                          setFocusCard({ ...row.original });
                        }}
                      >
                        Edit
                      </Button>
                    </SheetTrigger>
                    <SidebarCardEdit
                      card={focusCard}
                      handleClose={() => setFocusCard(undefined)}
                    />
                  </Sheet>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
