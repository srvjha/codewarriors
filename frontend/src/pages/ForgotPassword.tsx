import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import API from "@/utils/AxiosInstance";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { ForgotPasswordSchema, type ForgotPasswordFormValues } from "@/utils/ZodResolver";



const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const res = await API.post("/auth/password/forgot", data);
      if (res.data.success) {
        ToastSuccess(res.data.message);
      }
      reset()
    } catch (err: any) {
      ToastError(err?.response?.data?.error || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast />
      <div className="min-h-[calc(100vh-60px)] flex items-start justify-center  px-4 py-8">
        <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
          <h1 className="text-2xl font-semibold text-white text-center">
            Forgot Password
          </h1>
          <p className="text-sm text-zinc-400 text-center">
            Enter your email to receive a password reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register("email")}
                placeholder="Your email"
                type="email"
                className="bg-zinc-800 border border-zinc-700 focus:border-blue-500 text-white w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              className="w-full text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-lg font-medium transition"
              disabled={isLoading}
            >
              {isLoading ? <BeatLoader color="white" size={10} /> : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center text-sm mt-2 text-zinc-400">
            <Link
              to="/login"
              className="text-blue-500 hover:underline hover:text-blue-400"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
