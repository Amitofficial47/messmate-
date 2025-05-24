"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWeeklyMenu } from "@/lib/menuServices";
import type { WeeklyMenu, DayOfWeek, MealType } from "@/lib/types";
import { DAYS_OF_WEEK, MEAL_TYPES_ORDERED } from "@/lib/types";
import {
  Coffee,
  Sandwich,
  Utensils,
  NotebookPen,
  CalendarDays,
} from "lucide-react";

const mealIcons: Record<MealType, React.ElementType> = {
  Breakfast: Coffee,
  Lunch: Sandwich,
  Dinner: Utensils,
};

export default function MenuPage() {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    // JavaScript's getDay(): Sunday is 0, Monday is 1, ..., Saturday is 6
    // We want Monday to be 0, Sunday to be 6 to match DAYS_OF_WEEK array
    const dayIndex = (today.getDay() + 6) % 7;
    const currentDayName = DAYS_OF_WEEK[dayIndex];

    setSelectedDay(currentDayName);
    setWeeklyMenu(getWeeklyMenu());
    setIsLoading(false);
  }, []);

  if (isLoading || !weeklyMenu || !selectedDay) {
    return (
      <div className="container mx-auto py-8">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <NotebookPen className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-primary">Hostel Menu</h1>
          </div>
        </header>
        <p className="text-center text-lg text-muted-foreground">
          Loading menu...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <NotebookPen className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold text-primary">Hostel Menu</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          View the weekly meal offerings.
        </p>
      </header>

      <Tabs
        value={selectedDay}
        onValueChange={(value) => setSelectedDay(value as DayOfWeek)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7 mb-6">
          {DAYS_OF_WEEK.map((day) => (
            <TabsTrigger key={day} value={day}>
              <CalendarDays className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        {DAYS_OF_WEEK.map((day) => (
          <TabsContent key={day} value={day}>
            {day === selectedDay && weeklyMenu[day] && (
              <div className="mt-2">
                <h2 className="text-2xl font-semibold text-center mb-6 text-secondary-foreground">
                  Menu for {day}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {MEAL_TYPES_ORDERED.map((mealType) => {
                    const meal = weeklyMenu[day][mealType];
                    const IconComponent = mealIcons[mealType];
                    return (
                      <Card
                        key={mealType}
                        className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3 mb-1">
                            <IconComponent className="h-7 w-7 text-accent" />
                            <CardTitle className="text-2xl font-semibold text-primary">
                              {mealType}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow pt-2">
                          {meal.available ? (
                            <>
                              {meal.items.length > 0 ? (
                                <ul className="space-y-1.5 text-card-foreground">
                                  {meal.items.map((item, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <span className="text-accent mr-2">
                                        &#8226;
                                      </span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No items listed for this meal.
                                </p>
                              )}
                              {meal.notes && (
                                <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
                                  <span className="font-semibold">Notes:</span>{" "}
                                  {meal.notes}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-muted-foreground text-center py-4">
                              {meal.notes ||
                                `${mealType} is not available on ${day}.`}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <footer className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Menu is subject to change. Please check with mess staff for any
          allergies or dietary restrictions.
        </p>
      </footer>
    </div>
  );
}
