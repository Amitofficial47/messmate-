"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MealType } from "@/lib/types";
import { Utensils } from "lucide-react";
import React, { useState, useEffect } from "react";

interface MealCardProps {
  mealType: MealType;
  icon: React.ElementType; // This is the main icon for the meal type
  onSelect: () => void;
  isLoading?: boolean;
  isSelectable: boolean;
  selectionMessage: string;
  endTime: number | null;
  currentTime: Date | null;
}

export function MealCard({
  mealType,
  icon: Icon, // Renamed for clarity if needed, but Icon is fine
  onSelect,
  isLoading,
  isSelectable,
  selectionMessage,
  endTime,
  currentTime,
}: MealCardProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isSelectable && endTime && currentTime) {
      const updateTimer = () => {
        const nowMs = new Date().getTime();
        const remainingMs = endTime - nowMs;

        if (remainingMs > 0) {
          const totalSeconds = Math.floor(remainingMs / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          setTimeLeft(
            `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} remaining`
          );
        } else {
          setTimeLeft("Selection period ended");
          if (intervalId) clearInterval(intervalId);
        }
      };

      updateTimer();
      intervalId = setInterval(updateTimer, 1000);
    } else {
      setTimeLeft(null);
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSelectable, endTime, currentTime]);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full flex items-center justify-center bg-muted/30">
          {/* Display large icon instead of an image */}
          <Icon className="h-24 w-24 text-primary/70" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center mb-2">
          {/* This Icon is for the title section, kept as is */}
          <Icon className="h-6 w-6 mr-2 text-primary" />
          <CardTitle className="text-xl font-semibold">{mealType}</CardTitle>
        </div>
        <CardDescription>
          {selectionMessage}
          {timeLeft && (
            <p className="text-sm font-semibold text-accent mt-1">{timeLeft}</p>
          )}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button
          onClick={onSelect}
          className="w-full"
          disabled={isLoading || !isSelectable}
        >
          {isLoading ? `Selecting ${mealType}...` : `Select ${mealType}`}
          {!isLoading && <Utensils className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
