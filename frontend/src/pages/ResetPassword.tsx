import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import API from "@/utils/AxiosInstance";
import { Link, useParams } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { ResetPasswordSchema, type ResetPasswordFormValues } from "@/utils/ZodResolver";



const ResetPasswordPage = () => {

    const {token} = useParams()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      const res = await API.post(`/password/reset/${token}`, data);
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
            Reset Password
          </h1>
          <p className="text-sm text-zinc-400 text-center">
            Enter your New Password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register("password")}
                placeholder="Enter New Password"
                type="password"
                className="bg-zinc-800 border border-zinc-700 focus:border-blue-500 text-white w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              className="w-full text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-lg font-medium transition"
              disabled={isLoading}
            >
              {isLoading ? <BeatLoader color="white" size={10} /> : "Submit"}
            </Button>
          </form>

          <div className="text-center text-sm mt-2 text-zinc-400">
            <Link
              to="/"
              className="text-blue-500 hover:underline hover:text-blue-400"
            >
              Go to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
