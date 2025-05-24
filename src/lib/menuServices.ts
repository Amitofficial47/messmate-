"use client"; // This service will be used by client components and interacts with localStorage

import type { WeeklyMenu, DayOfWeek, MealType, SingleMealMenu } from "./types";
import { DAYS_OF_WEEK, MEAL_TYPES_ORDERED } from "./types";

const LOCAL_STORAGE_KEY = "messmate-weekly-menu";

export function getDefaultWeeklyMenu(): WeeklyMenu {
  const defaultMenu: Partial<WeeklyMenu> = {};
  DAYS_OF_WEEK.forEach((day) => {
    defaultMenu[day] = {
      Breakfast: { items: ["Toast", "Tea/Coffee"], notes: "", available: true },
      Lunch: {
        items: day === "Sunday" ? ["Sunday Special Lunch"] : [],
        notes: day === "Sunday" ? "" : "Not typically available",
        available: day === "Sunday",
      },
      Dinner: { items: ["Roti", "Sabzi", "Dal"], notes: "", available: true },
    };
  });
  return defaultMenu as WeeklyMenu;
}

export function getWeeklyMenu(): WeeklyMenu {
  if (typeof window !== "undefined") {
    const storedMenu = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedMenu) {
      try {
        return JSON.parse(storedMenu) as WeeklyMenu;
      } catch (error) {
        console.error("Failed to parse weekly menu from localStorage", error);
        // Fallback to default if parsing fails
      }
    }
  }
  return getDefaultWeeklyMenu();
}

export function saveWeeklyMenu(menu: WeeklyMenu): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(menu));
    } catch (error) {
      console.error("Failed to save weekly menu to localStorage", error);
    }
  }
}

export function updateDailyMeal(
  currentMenu: WeeklyMenu,
  day: DayOfWeek,
  mealType: MealType,
  updatedMeal: Partial<SingleMealMenu>
): WeeklyMenu {
  const newMenu = { ...currentMenu };
  newMenu[day] = {
    ...newMenu[day],
    [mealType]: {
      ...newMenu[day][mealType],
      ...updatedMeal,
    },
  };
  return newMenu;
}
