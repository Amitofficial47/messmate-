"use client";
import { MealSummaryCard } from "@/components/admin/MealSummaryCard";
import { ActiveTokensTable } from "@/components/admin/ActiveTokensTable";
import { useMeal } from "@/hooks/use-meal";
import type { MealCount, MealSelection, MealType } from "@/lib/types";
import { Coffee, Sandwich, Utensils as DinnerIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner"];
const mealIcons = {
  Breakfast: Coffee,
  Lunch: Sandwich,
  Dinner: DinnerIcon,
};
const getCurrentDate = () => new Date().toISOString().split("T")[0];

export default function AdminDashboardPage() {
  const { getAllMealSelections, loading: mealLoading } = useMeal();
  const [mealCounts, setMealCounts] = useState<MealCount[]>([]);
  const [activeTokens, setActiveTokens] = useState<MealSelection[]>([]);
  const [allTokens, setAllTokens] = useState<MealSelection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mealLoading) {
      const allSelections = getAllMealSelections();
      const today = getCurrentDate();

      const todaySelections = allSelections.filter((sel) => sel.date === today);

      const counts = mealTypes.map((type) => ({
        mealType: type,
        count: todaySelections.filter((sel) => sel.mealType === type).length,
      }));
      setMealCounts(counts);

      const currentActiveTokens = todaySelections.filter(
        (sel) => !sel.consumed
      );
      setActiveTokens(currentActiveTokens);
      setAllTokens(allSelections); // For history tab
      setIsLoading(false);
    }
  }, [getAllMealSelections, mealLoading]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4 text-secondary-foreground">
        Today's Meal Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mealCounts.map((mc) => (
          <MealSummaryCard
            key={mc.mealType}
            mealType={mc.mealType}
            count={mc.count}
            icon={mealIcons[mc.mealType]}
          />
        ))}
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="active">Active Tokens (Today)</TabsTrigger>
          <TabsTrigger value="history">All Tokens History</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <ActiveTokensTable
            tokens={activeTokens}
            title="Active Meal Tokens for Today"
          />
        </TabsContent>
        <TabsContent value="history">
          <ActiveTokensTable
            tokens={allTokens}
            title="All Meal Token History"
            showConsumed={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
