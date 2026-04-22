import { z } from "zod";

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  street: z
    .string()
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address is too long"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City name is too long"),
  state: z
    .string()
    .min(2, "State is required")
    .max(100, "State name is too long"),
  zipCode: z
    .string()
    .min(3, "ZIP code is required")
    .max(20, "ZIP code is too long"),
  country: z
    .string()
    .min(2, "Country is required")
    .max(100, "Country name is too long"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number is too long"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const searchSchema = z.object({
  query: z.string().min(1).max(200),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
