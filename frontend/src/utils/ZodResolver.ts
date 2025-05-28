import type { CreateProblemFormValues } from "@/types/createProblem/createProblemTypes";
import type { Resolver } from "react-hook-form";
import { z } from "zod";

export type FormValues = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar?: FileList | null | string; 
};

export type LoginFormValues = {
  email:string,
  password: string
}

export type PasswordFormValues = {
  oldPassword:string,
  newPassword:string,
  confirmNewPassword:string,
}



export const resolver: Resolver<FormValues> = async (values) => {
  const errors: Record<string, any> = {};

  if (!values.fullName) {
    errors.fullName = {
      type: "required",
      message: "Full name is required.",
    };
  }

  if (!values.username) {
    errors.username = {
      type: "required",
      message: "Username is required.",
    };
  }

  if (!values.email) {
    errors.email = {
      type: "required",
      message: "Email is required.",
    };
  }

  if (!values.password) {
    errors.password = {
      type: "required",
      message: "Password is required.",
    };
  }

  // avatar is optional 

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

export const LoginResolver: Resolver<LoginFormValues> = async (values) => {
  const errors: Record<string, any> = {};

  if (!values.email) {
    errors.email = {
      type: "required",
      message: "Email is required.",
    };
  }

  if (!values.password) {
    errors.password = {
      type: "required",
      message: "Password is required.",
    };
  }
  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

export const CreateProblemResolver: Resolver<CreateProblemFormValues> = async (values) => {
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

  if(!values.languages){
    errors.languages = {
      type: "required",
      message: "At least one language is required.",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
}

export const PasswordResolver: Resolver<PasswordFormValues> = async (values) => {
  const errors: Record<string, any> = {};

  if (!values.oldPassword) {
    errors.oldPassword = {
      type: "required",
      message: "Old Password is required.",
    };
  }

  if (!values.newPassword) {
    errors.newPassword = {
      type: "required",
      message: "New Password is required.",
    };
  }

  if (!values.confirmNewPassword) {
    errors.confirmNewPassword = {
      type: "required",
      message: "Confirm New Password is required.",
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

export const ResetPasswordSchema = z.object({
  password: z.string().nonempty("Password Required!"),
});

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;