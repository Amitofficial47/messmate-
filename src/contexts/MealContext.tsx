"use client";
import type { MealSelection, MealType, User } from "@/lib/types";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useToast } from "@/hooks/use-toast";

interface MealContextType {
  mealSelections: MealSelection[];
  addMealSelection: (
    user: User,
    mealType: MealType
  ) => Promise<{ token: string } | null>;
  getStudentMealHistory: (userId: string) => MealSelection[];
  getAllMealSelections: () => MealSelection[];
  getMealSelectionsByDateAndType: (
    date: string,
    mealType: MealType
  ) => MealSelection[];
  markTokenAsConsumed: (tokenId: string) => void;
  loading: boolean;
}

export const MealContext = createContext<MealContextType | undefined>(
  undefined
);

const generateToken = () =>
  Math.random().toString(36).substr(2, 8).toUpperCase();
const getCurrentDate = () => new Date().toISOString().split("T")[0];

export const MealProvider = ({ children }: { children: ReactNode }) => {
  const [mealSelections, setMealSelections] = useState<MealSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedSelections = localStorage.getItem("messmate-meals");
    if (storedSelections) {
      try {
        setMealSelections(JSON.parse(storedSelections));
      } catch (error) {
        console.error("Failed to parse stored meal selections", error);
        localStorage.removeItem("messmate-meals");
      }
    }
    setLoading(false);
  }, []);

  const updateLocalStorage = (updatedSelections: MealSelection[]) => {
    localStorage.setItem("messmate-meals", JSON.stringify(updatedSelections));
  };

  const addMealSelection = useCallback(
    async (
      user: User,
      mealType: MealType
    ): Promise<{ token: string } | null> => {
      setLoading(true);
      const today = getCurrentDate();
      const existingSelection = mealSelections.find(
        (ms) =>
          ms.userId === user.id && ms.mealType === mealType && ms.date === today
      );

      if (existingSelection) {
        toast({
          title: "Already Selected",
          description: `You have already selected ${mealType} for today. Your token is ${existingSelection.token}.`,
          variant: "default",
        });
        setLoading(false);
        return { token: existingSelection.token };
      }

      const newSelection: MealSelection = {
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        mealType,
        date: today,
        token: generateToken(),
        consumed: false,
        timestamp: Date.now(),
      };

      const updatedSelections = [...mealSelections, newSelection];
      setMealSelections(updatedSelections);
      updateLocalStorage(updatedSelections);
      setLoading(false);
      return { token: newSelection.token };
    },
    [mealSelections, toast]
  );

  const getStudentMealHistory = useCallback(
    (userId: string): MealSelection[] => {
      return mealSelections
        .filter((ms) => ms.userId === userId)
        .sort((a, b) => b.timestamp - a.timestamp);
    },
    [mealSelections]
  );

  const getAllMealSelections = useCallback((): MealSelection[] => {
    return [...mealSelections].sort((a, b) => b.timestamp - a.timestamp);
  }, [mealSelections]);

  const getMealSelectionsByDateAndType = useCallback(
    (date: string, mealType: MealType): MealSelection[] => {
      return mealSelections.filter(
        (ms) => ms.date === date && ms.mealType === mealType
      );
    },
    [mealSelections]
  );

  const markTokenAsConsumed = useCallback(
    (tokenId: string) => {
      setLoading(true);
      const updatedSelections = mealSelections.map((ms) =>
        ms.token === tokenId ? { ...ms, consumed: true } : ms
      );
      setMealSelections(updatedSelections);
      updateLocalStorage(updatedSelections);
      setLoading(false);
      toast({
        title: "Token Verified",
        description: "Meal token marked as consumed.",
        variant: "default",
      });
    },
    [mealSelections, toast]
  );

  return (
    <MealContext.Provider
      value={{
        mealSelections,
        addMealSelection,
        getStudentMealHistory,
        getAllMealSelections,
        getMealSelectionsByDateAndType,
        markTokenAsConsumed,
        loading,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};
