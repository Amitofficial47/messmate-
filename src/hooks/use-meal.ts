"use client";
import { MealContext } from "@/contexts/MealContext";
import { useContext } from "react";

export const useMeal = () => {
  const context = useContext(MealContext);
  if (context === undefined) {
    throw new Error("useMeal must be used within a MealProvider");
  }
  return context;
};
