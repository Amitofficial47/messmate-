"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { MealSelection } from "@/lib/types";
import { CheckCircle, XCircle, ShieldQuestion } from "lucide-react";
import { useMeal } from "@/hooks/use-meal";
import { format } from "date-fns";
import React, { useState } from "react"; // Added useState
import { Input } from "@/components/ui/input"; // Added Input
import { useToast } from "@/hooks/use-toast"; // Added useToast
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActiveTokensTableProps {
  tokens: MealSelection[];
  title: string;
  showConsumed?: boolean;
}

const obfuscateToken = (token: string): string => {
  if (token.length <= 4) {
    return "****";
  }
  return `****${token.slice(-4)}`;
};

export function ActiveTokensTable({
  tokens,
  title,
  showConsumed = false,
}: ActiveTokensTableProps) {
  const { markTokenAsConsumed, loading: mealLoading } = useMeal();
  const { toast } = useToast();
  const [enteredTokens, setEnteredTokens] = useState<Record<string, string>>(
    {}
  ); // To store input for each token

  const handleInputChange = (tokenId: string, value: string) => {
    setEnteredTokens((prev) => ({ ...prev, [tokenId]: value }));
  };

  const handleVerifyAndConsume = (item: MealSelection) => {
    const enteredValue = enteredTokens[item.id]?.trim().toUpperCase();
    if (!enteredValue) {
      toast({
        title: "Input Required",
        description: "Please enter the student's token.",
        variant: "destructive",
      });
      return;
    }

    if (enteredValue === item.token.toUpperCase()) {
      markTokenAsConsumed(item.token); // markTokenAsConsumed uses the actual token string
      setEnteredTokens((prev) => ({ ...prev, [item.id]: "" })); // Clear input on success
      toast({
        title: "Token Verified",
        description: `Token for ${item.userName} consumed.`,
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "The entered token is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredTokens = tokens.filter((token) =>
    showConsumed ? true : !token.consumed
  );

  if (filteredTokens.length === 0 && !showConsumed) {
    return (
      <p className="text-center text-muted-foreground mt-4">
        No active tokens for today.
      </p>
    );
  }
  if (filteredTokens.length === 0 && showConsumed) {
    return (
      <p className="text-center text-muted-foreground mt-4">
        No token history available.
      </p>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Meal Type</TableHead>
                <TableHead>Token (Masked)</TableHead>
                {!showConsumed && <TableHead>Enter & Verify Token</TableHead>}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTokens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {format(new Date(item.timestamp), "PP p")}
                  </TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{item.mealType}</TableCell>
                  <TableCell className="font-mono">
                    {obfuscateToken(item.token)}
                  </TableCell>
                  {!showConsumed && (
                    <TableCell>
                      {!item.consumed ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            placeholder="Enter token..."
                            value={enteredTokens[item.id] || ""}
                            onChange={(e) =>
                              handleInputChange(item.id, e.target.value)
                            }
                            className="h-9 w-36"
                            disabled={mealLoading}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyAndConsume(item)}
                            disabled={mealLoading || !enteredTokens[item.id]}
                          >
                            <ShieldQuestion className="mr-1 h-4 w-4" />
                            Verify
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    {item.consumed ? (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 w-24 justify-center"
                      >
                        <XCircle className="h-3 w-3" /> Consumed
                      </Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="flex items-center gap-1 w-24 justify-center"
                      >
                        <CheckCircle className="h-3 w-3" /> Active
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
