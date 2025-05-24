"use client";
import { MealHistoryTable } from "@/components/student/MealHistoryTable";
import { useAuth } from "@/hooks/useAuth";
import { useMeal } from "@/hooks/use-meal";
import { useEffect, useState } from "react";
import type { MealSelection } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { History as HistoryIcon } from "lucide-react";

export default function MealHistoryPage() {
  const { user } = useAuth();
  const { getStudentMealHistory, loading: mealLoading } = useMeal();
  const [history, setHistory] = useState<MealSelection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && !mealLoading) {
      const userHistory = getStudentMealHistory(user.id);
      setHistory(userHistory);
      setIsLoading(false);
    } else if (!mealLoading && !user) {
      setIsLoading(false);
    }
  }, [user, getStudentMealHistory, mealLoading]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HistoryIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-primary">
              Your Meal History
            </h1>
          </div>
        </header>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <HistoryIcon className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-primary">Your Meal History</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Review all your past meal selections and their status.
        </p>
      </header>
      <MealHistoryTable history={history} />
    </div>
  );
}
