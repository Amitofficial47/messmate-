"use client";
import { useAuth } from "@/hooks/useAuth";
import { useMeal } from "@/hooks/use-meal";
import { useEffect, useState } from "react";
import type { MealSelection } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Coins, Info } from "lucide-react";
import { isSameMonth, isSameYear } from "date-fns";

const PRICE_PER_MEAL = 35; // Price per meal in arbitrary units

export default function MonthlySummaryPage() {
  const { user } = useAuth();
  const { getStudentMealHistory, loading: mealLoading } = useMeal();
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyMealCount, setMonthlyMealCount] = useState(0);
  const [monthlyBill, setMonthlyBill] = useState(0);

  useEffect(() => {
    if (user && !mealLoading) {
      const userHistory = getStudentMealHistory(user.id);
      const now = new Date();
      const currentMonthConsumedMeals = userHistory.filter((meal) => {
        const mealDate = new Date(meal.timestamp);
        return (
          meal.consumed &&
          isSameMonth(mealDate, now) &&
          isSameYear(mealDate, now)
        );
      });

      const count = currentMonthConsumedMeals.length;
      setMonthlyMealCount(count);
      setMonthlyBill(count * PRICE_PER_MEAL);
      setIsLoading(false);
    } else if (!user && !mealLoading) {
      setIsLoading(false);
    }
  }, [user, getStudentMealHistory, mealLoading]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          Monthly Summary
        </h1>
        <Card className="shadow-md bg-card border border-border rounded-lg">
          <CardHeader className="flex flex-row items-center space-x-3 pb-3">
            <Info className="h-6 w-6 text-primary" />
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          Monthly Summary
        </h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Please log in to view your monthly summary.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-primary">
            Your Monthly Summary
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Here's an overview of your meal consumption and estimated bill for the
          current month.
        </p>
      </header>

      <Card className="shadow-md bg-card border border-border rounded-lg">
        <CardHeader className="flex flex-row items-center space-x-3 pb-3">
          <Info className="h-7 w-7 text-primary" />
          <CardTitle className="text-2xl font-semibold text-card-foreground">
            Summary for this Month
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 space-y-3">
          <div className="flex items-center text-lg">
            <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground" />
            <p className="text-card-foreground">
              Total meals consumed:{" "}
              <span className="font-bold text-primary">{monthlyMealCount}</span>
            </p>
          </div>
          <div className="flex items-center text-lg">
            <Coins className="h-5 w-5 mr-3 text-muted-foreground" />
            <p className="text-card-foreground">
              Estimated bill:{" "}
              <span className="font-bold text-primary">
                {monthlyBill} units
              </span>
            </p>
          </div>
          <CardDescription className="text-sm pt-2">
            This summary is based on a rate of {PRICE_PER_MEAL} units per
            consumed meal for the current calendar month. Final bill may vary
            and will be available in the "Hostel Bills" section.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

// Manually add Activity icon as it's used in this file
import { Activity } from "lucide-react";
