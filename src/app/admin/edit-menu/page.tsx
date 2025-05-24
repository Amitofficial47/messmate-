"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getWeeklyMenu,
  saveWeeklyMenu,
  updateDailyMeal,
  getDefaultWeeklyMenu,
} from "@/lib/menuServices";
import type {
  WeeklyMenu,
  DayOfWeek,
  MealType,
  SingleMealMenu,
} from "@/lib/types";
import { DAYS_OF_WEEK, MEAL_TYPES_ORDERED } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw } from "lucide-react";

export default function EditMenuPage() {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DAYS_OF_WEEK[0]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setWeeklyMenu(getWeeklyMenu());
    setIsLoading(false);
  }, []);

  const handleMealChange = useCallback(
    (
      mealType: MealType,
      field: keyof SingleMealMenu,
      value: string | boolean | string[]
    ) => {
      if (!weeklyMenu) return;

      let updatedMealPart: Partial<SingleMealMenu> = {};
      if (field === "items" && typeof value === "string") {
        updatedMealPart = {
          items: value
            .split("\\n")
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
        };
      } else if (field === "notes" && typeof value === "string") {
        updatedMealPart = { notes: value };
      } else if (field === "available" && typeof value === "boolean") {
        updatedMealPart = { available: value };
      } else {
        return; // Unknown field or type
      }

      const newMenu = updateDailyMeal(
        weeklyMenu,
        selectedDay,
        mealType,
        updatedMealPart
      );
      setWeeklyMenu(newMenu);
    },
    [weeklyMenu, selectedDay]
  );

  const handleSaveChanges = () => {
    if (weeklyMenu) {
      saveWeeklyMenu(weeklyMenu);
      toast({
        title: "Menu Saved",
        description: `Menu for ${selectedDay} (and any other changes) has been saved.`,
      });
    }
  };

  const handleResetToDefault = () => {
    const defaultMenu = getDefaultWeeklyMenu();
    setWeeklyMenu(defaultMenu);
    saveWeeklyMenu(defaultMenu);
    toast({
      title: "Menu Reset",
      description: "The entire weekly menu has been reset to default values.",
    });
  };

  if (isLoading || !weeklyMenu) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Edit Weekly Menu
        </h1>
        <p>Loading menu editor...</p>
      </div>
    );
  }

  const currentDayMenu = weeklyMenu[selectedDay];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Edit Weekly Menu</h1>
        <div>
          <Button onClick={handleSaveChanges} className="mr-2">
            <Save className="mr-2 h-4 w-4" /> Save All Changes
          </Button>
          <Button onClick={handleResetToDefault} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset to Default
          </Button>
        </div>
      </div>

      <Tabs
        value={selectedDay}
        onValueChange={(value) => setSelectedDay(value as DayOfWeek)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7 mb-6">
          {DAYS_OF_WEEK.map((day) => (
            <TabsTrigger key={day} value={day}>
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        {DAYS_OF_WEEK.map((day) => (
          <TabsContent key={day} value={day}>
            {day === selectedDay && currentDayMenu && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {MEAL_TYPES_ORDERED.map((mealType) => {
                  const meal = currentDayMenu[mealType];
                  return (
                    <Card key={mealType} className="shadow-md">
                      <CardHeader>
                        <CardTitle className="text-xl text-secondary-foreground">
                          {mealType}
                        </CardTitle>
                        <CardDescription>
                          Menu for {mealType.toLowerCase()} on {selectedDay}.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label
                            htmlFor={`${day}-${mealType}-items`}
                            className="text-sm font-medium"
                          >
                            Items (one per line)
                          </Label>
                          <Textarea
                            id={`${day}-${mealType}-items`}
                            value={meal.items.join("\\n")}
                            onChange={(e) =>
                              handleMealChange(
                                mealType,
                                "items",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Item 1\\nItem 2"
                            className="mt-1 min-h-[100px]"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`${day}-${mealType}-notes`}
                            className="text-sm font-medium"
                          >
                            Notes
                          </Label>
                          <Input
                            id={`${day}-${mealType}-notes`}
                            value={meal.notes}
                            onChange={(e) =>
                              handleMealChange(
                                mealType,
                                "notes",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Special, Contains nuts"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id={`${day}-${mealType}-available`}
                            checked={meal.available}
                            onCheckedChange={(checked) =>
                              handleMealChange(mealType, "available", !!checked)
                            }
                            disabled={
                              mealType === "Lunch" &&
                              selectedDay !== "Sunday" &&
                              weeklyMenu[selectedDay][mealType].notes.includes(
                                "Not typically available"
                              )
                            }
                          />
                          <Label
                            htmlFor={`${day}-${mealType}-available`}
                            className="text-sm font-medium"
                          >
                            Available
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-8 text-center">
        <Button onClick={handleSaveChanges} size="lg">
          <Save className="mr-2 h-5 w-5" /> Save All Changes
        </Button>
      </div>
    </div>
  );
}
