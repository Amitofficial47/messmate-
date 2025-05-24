import type { User } from "./types";

const LOCAL_STORAGE_USERS_KEY = "messmate-mock-users";

// Initial seed users - these users will not have a 'password' field stored initially
// and will rely on the fallback login mechanism.
const INITIAL_MOCK_USERS: User[] = [
  {
    id: "student1",
    email: "student@example.com",
    name: "Test Student",
    role: "student",
    hostel: "Hostel A",
  },
  {
    id: "admin1",
    email: "admin@example.com",
    name: "Test Admin",
    role: "admin",
    hostel: "N/A",
  },
  {
    id: "studenta",
    email: "studenta@example.com",
    name: "Student A (Hostel A)",
    role: "student",
    hostel: "Hostel A",
  },
  {
    id: "studentb",
    email: "studentb@example.com",
    name: "Student B (Hostel A)",
    role: "student",
    hostel: "Hostel A",
  },
  {
    id: "studentc",
    email: "studentc@example.com",
    name: "Student C (Hostel A)",
    role: "student",
    hostel: "Hostel A",
  },
  {
    id: "studentd",
    email: "studentd@example.com",
    name: "Student D (Hostel A)",
    role: "student",
    hostel: "Hostel A",
  },
  {
    id: "studente",
    email: "studente@example.com",
    name: "Student E (Hostel A)",
    role: "student",
    hostel: "Hostel A",
  },
  {
    id: "studentf",
    email: "studentf@example.com",
    name: "Student F (Hostel A)",
    role: "student",
    hostel: "Hostel A",
  },
  {
    id: "studentg",
    email: "studentg@example.com",
    name: "Student G (Hostel A)",
    role: "student",
    hostel: "Hostel A",
  },
  {
    id: "studenth",
    email: "studenth@example.com",
    name: "Student H (Hostel A)",
    role: "student",
    hostel: "Hostel A",
  },
  {
    id: "studenti",
    email: "studenti@example.com",
    name: "Student I (Hostel A)",
    role: "student",
    hostel: "Hostel A",
  },
  {
    id: "studentj",
    email: "studentj@example.com",
    name: "Student J (Hostel A)",
    role: "student",
    hostel: "Hostel A",
  },
];

export function getMockUsers(): User[] {
  if (typeof window !== "undefined") {
    const storedUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (storedUsers) {
      try {
        // Ensure all users from storage have the optional password field for type consistency
        return JSON.parse(storedUsers).map((user: any) => ({
          ...user,
          password: user.password || undefined,
        }));
      } catch (e) {
        console.error("Failed to parse users from localStorage", e);
        // Fallback to initial and save
        localStorage.setItem(
          LOCAL_STORAGE_USERS_KEY,
          JSON.stringify(INITIAL_MOCK_USERS)
        );
        return INITIAL_MOCK_USERS;
      }
    } else {
      // Initialize localStorage with initial users
      localStorage.setItem(
        LOCAL_STORAGE_USERS_KEY,
        JSON.stringify(INITIAL_MOCK_USERS)
      );
      return INITIAL_MOCK_USERS;
    }
  }
  return INITIAL_MOCK_USERS; // Fallback for non-browser environments
}

export function saveMockUsers(users: User[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  }
}

export async function login(
  email: string,
  passwordToCheck?: string
): Promise<User | null> {
  const users = getMockUsers();
  const user = users.find((u) => u.email === email);

  if (user) {
    // If the user object has a password stored (meaning they registered with one)
    if (user.password) {
      if (user.password === passwordToCheck) {
        // Return a copy of the user object without the password for security/best practice
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    // Fallback for initial mock users who don't have a password field stored
    // and use the generic "password"
    else if (passwordToCheck === "password") {
      return user; // These users don't have a password field, so no need to strip it
    }
  }
  return null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const users = getMockUsers();
  const foundUser = users.find((u) => u.id === userId);
  if (foundUser) {
    const { password, ...userWithoutPassword } = foundUser;
    return userWithoutPassword;
  }
  return null;
}

export interface RegisterUserResult {
  success: boolean;
  message: string;
  user?: Omit<User, "password">; // Return user without password
}

export async function registerUser(
  name: string,
  email: string,
  pass: string,
  hostel: string
): Promise<RegisterUserResult> {
  const users = getMockUsers();
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return { success: false, message: "Email already exists." };
  }

  const newUser: User = {
    id: crypto.randomUUID(), // Generate a unique ID
    name,
    email,
    password: pass, // Store the provided password
    role: "student", // New users are students by default
    hostel,
  };

  const updatedUsers = [...users, newUser];
  saveMockUsers(updatedUsers);

  const { password, ...userWithoutPassword } = newUser;
  return {
    success: true,
    message: "User registered successfully!",
    user: userWithoutPassword,
  };
}
