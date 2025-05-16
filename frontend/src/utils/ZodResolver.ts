import type { Resolver } from "react-hook-form";

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