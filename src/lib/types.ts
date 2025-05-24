export type UserRole = "student" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hostel?: string;
  password?: string; // Added password field for registered users
}

export type MealType = "Breakfast" | "Lunch" | "Dinner";

export interface MealSelection {
  id: string;
  userId: string;
  userName: string;
  mealType: MealType;
  date: string; // YYYY-MM-DD
  token: string;
  consumed: boolean;
  timestamp: number;
}

export interface MealCount {
  mealType: MealType;
  count: number;
}

// Menu System Types
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const MEAL_TYPES_ORDERED: MealType[] = ["Breakfast", "Lunch", "Dinner"];

export interface SingleMealMenu {
  items: string[];
  notes: string;
  available: boolean;
}

export type DailyMenu = Record<MealType, SingleMealMenu>;

export type WeeklyMenu = Record<DayOfWeek, DailyMenu>;

// Notification Type (already defined in admin/add-notification/page.tsx, but good to have a central spot if needed)
// Re-exporting or defining here for clarity if it becomes more broadly used.
export type NotificationType = "info" | "alert" | "event";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  sentAt: string;
}

// Uploaded Bill Type
export interface UploadedBill {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// Feedback Type
export interface FeedbackItem {
  id: string;
  studentId: string;
  studentName: string;
  feedbackText: string;
  submittedAt: string; // ISO string date
}
