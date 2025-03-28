
import { z } from "zod";

// Common validation schemas
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters");

// Common validation functions
export const validateEmail = (email: string): string | null => {
  try {
    emailSchema.parse(email);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "Invalid email";
  }
};

export const validatePassword = (password: string): string | null => {
  try {
    passwordSchema.parse(password);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "Invalid password";
  }
};

// Utility function to get validation error message
export const getValidationErrorMessage = (error: unknown): string => {
  if (error instanceof z.ZodError) {
    const errors = error.errors.map((e) => e.message);
    return errors.join(", ");
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unknown error occurred";
};
