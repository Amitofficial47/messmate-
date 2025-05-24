"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MealType } from "@/lib/types";

interface MealSummaryCardProps {
  mealType: MealType;
  count: number;
  icon: React.ElementType;
}

export function MealSummaryCard({
  mealType,
  count,
  icon: Icon,
}: MealSummaryCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium text-primary">
          {mealType}
        </CardTitle>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          Total {mealType.toLowerCase()} selections for today.
        </p>
      </CardContent>
    </Card>
  );
}
