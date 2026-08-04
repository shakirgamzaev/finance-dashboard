"use client";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { TransactionRow } from "@/app/models/transaction";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  transaction: TransactionRow;
  onEdit: (transaction: TransactionRow) => void;
  onDelete: (transaction: TransactionRow) => void;
};

export const Actions = ({ transaction, onEdit, onDelete }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"ghost"} className="size-7 p-0">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(transaction)}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(transaction)}>
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
