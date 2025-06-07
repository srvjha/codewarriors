
import type { CreateProblemFormValues } from "@/types/createProblem/createProblemTypes";
import { z } from "zod";
import type { Resolver } from "react-hook-form";

export const FormSchema = z.object({
  fullName: z.string().nonempty("Full name is required."),
  username: z.string().nonempty("Username is required."),
  email: z.string().email("Please enter a valid email"),
  password: z.string().nonempty("Password is required."),
  avatar: z.any().optional(),
});

export type FormValues = z.infer<typeof FormSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().nonempty("Password is required."),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;


export const PasswordSchema = z.object({
  oldPassword: z.string().nonempty("Old Password is required."),
  newPassword: z.string().nonempty("New Password is required."),
  confirmNewPassword: z.string().nonempty("Confirm New Password is required."),
});

export type PasswordFormValues = z.infer<typeof PasswordSchema>;

export const DiscussSchema = z.object({
  title: z.string().nonempty("Title is required."),
  content: z.string().nonempty("Content is required."),
   topics: z.array(z.string()).optional(),
});

export type DiscussFormValues = z.infer<typeof DiscussSchema>;

export const CreateProblemSchema: Resolver<CreateProblemFormValues> = async (
  values
) => {
  const errors: Record<string, any> = {};

  if (!values.title) {
    errors.title = {
      type: "required",
      message: "Title is required.",
    };
  }

  if (!values.description) {
    errors.description = {
      type: "required",
      message: "Description is required.",
    };
  }

  if (!values.difficulty) {
    errors.difficulty = {
      type: "required",
      message: "Difficulty is required.",
    };
  }

  if (!values.tags || values.tags.length === 0) {
    errors.tags = {
      type: "required",
      message: "At least one tag is required.",
    };
  }

  if (!values.testcases || values.testcases.length === 0) {
    errors.testcases = {
      type: "required",
      message: "At least one test case is required.",
    };
  }

  if (!values.examples || values.examples.length === 0) {
    errors.examples = {
      type: "required",
      message: "At least one example is required.",
    };
  }

  if (!values.constraints) {
    errors.constraints = {
      type: "required",
      message: "Constraints are required.",
    };
  }

  if (!values.languages) {
    errors.languages = {
      type: "required",
      message: "At least one language is required.",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};


export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export const ResetForgotPasswordSchema = z.object({
  password: z.string().nonempty("Password is required"),
});

export type ResetForgotPasswordFormValues = z.infer<typeof ResetForgotPasswordSchema>;


export const ResetPasswordSchema = z.object({
  password: z.string().nonempty("Password Required!"),
});

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

