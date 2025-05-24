"use client";
import { MealCard } from "@/components/student/MealCard";
import { TokenDisplay } from "@/components/student/TokenDisplay";
import { useAuth } from "@/hooks/useAuth";
import { useMeal } from "@/hooks/use-meal";
import type { MealType } from "@/lib/types";
import { Coffee, Sandwich, Utensils as DinnerIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const mealOptions = [
  { type: "Breakfast" as MealType, icon: Coffee },
  { type: "Lunch" as MealType, icon: Sandwich },
  { type: "Dinner" as MealType, icon: DinnerIcon },
];

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { addMealSelection, loading: mealLoading } = useMeal();
  const { toast } = useToast();
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(
    null
  );
  const [currentLoadingMeal, setCurrentLoadingMeal] = useState<MealType | null>(
    null
  );
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timerId = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timerId);
  }, []);

  const getMealEligibility = (
    mealType: MealType,
    now: Date | null
  ): {
    isButtonEnabled: boolean;
    selectionMessage: string;
    endTime: number | null;
  } => {
    // All meal selections are always active
    return {
      isButtonEnabled: true,
      selectionMessage: `Select your ${mealType.toLowerCase()}.`,
      endTime: null, // Countdown timer is disabled
    };
  };

  const handleSelectMeal = async (mealType: MealType) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in.",
        variant: "destructive",
      });
      return;
    }
    setCurrentLoadingMeal(mealType);
    const result = await addMealSelection(user, mealType);
    if (result?.token) {
      setSelectedToken(result.token);
      setSelectedMealType(mealType);
      setShowTokenModal(true);
      toast({
        title: `${mealType} Selected!`,
        description: `Your token for ${mealType} is ${result.token}.`,
      });
    } else if (!result) {
      toast({
        title: "Selection Failed",
        description: `Could not select ${mealType}. Please try again.`,
        variant: "destructive",
      });
    }
    setCurrentLoadingMeal(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        Select Your Meal for Today
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mealOptions.map((meal) => {
          const eligibility = getMealEligibility(meal.type, currentTime);
          return (
            <MealCard
              key={meal.type}
              mealType={meal.type}
              icon={meal.icon}
              onSelect={() => handleSelectMeal(meal.type)}
              isLoading={currentLoadingMeal === meal.type}
              isSelectable={eligibility.isButtonEnabled}
              selectionMessage={eligibility.selectionMessage}
              endTime={eligibility.endTime}
              currentTime={currentTime}
            />
          );
        })}
      </div>
      {selectedToken && selectedMealType && (
        <TokenDisplay
          isOpen={showTokenModal}
          onOpenChange={setShowTokenModal}
          token={selectedToken}
          mealType={selectedMealType}
        />
      )}
    </div>
  );
}
