"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface TableComponentProps<T> {
  headings: TableColumn[];
  data: T[];
  onDelete?: (id: string | number) => void; // Optional to support cases without onDelete
  getEditUrl?: (id: string | number) => string; // Optional
}

const TableComponent = <T extends { id: string | number }>({
  headings,
  data,
  onDelete,
  getEditUrl,
}: TableComponentProps<T>) => {
  const handleDelete = (id: string | number) => {
    if (onDelete) onDelete(id);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headings.map((heading) => (
              <TableHead key={heading.key} className={heading.key === "actions" ? "text-right" : ""}>
                {heading.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {headings.map((heading) =>
                heading.key === "actions" && heading.render ? (
                  <TableCell key={heading.key} className="text-right">
                    {heading.render(null, item)}
                  </TableCell>
                ) : heading.key === "actions" ? (
                  <TableCell key={heading.key} className="text-right">
                    {onDelete && getEditUrl ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={getEditUrl(item.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </TableCell>
                ) : (
                  <TableCell key={heading.key}>
                    {/* @ts-ignore */}
                    {heading.render ? heading.render(item[heading.key as keyof T], item) : item[heading.key as keyof T]}
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;