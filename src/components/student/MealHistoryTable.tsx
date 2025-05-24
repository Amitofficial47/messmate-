"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { MealSelection } from "@/lib/types";
import { format } from "date-fns";

interface MealHistoryTableProps {
  history: MealSelection[];
}

export function MealHistoryTable({ history }: MealHistoryTableProps) {
  if (history.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-8">
        You have no meal selections yet.
      </p>
    );
  }

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Meal Type</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{format(new Date(item.timestamp), "PP p")}</TableCell>
              <TableCell>{item.mealType}</TableCell>
              <TableCell className="font-mono">{item.token}</TableCell>
              <TableCell>
                <Badge variant={item.consumed ? "secondary" : "default"}>
                  {item.consumed ? "Consumed" : "Active"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
