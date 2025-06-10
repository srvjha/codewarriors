import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import API from "@/utils/AxiosInstance";
import { Link, useParams } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import {
  ResetForgotPasswordSchema,
  type ResetForgotPasswordFormValues,
} from "@/utils/ZodResolver";
import { Eye, EyeOff } from "lucide-react";

const ResetForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetForgotPasswordFormValues>({
    resolver: zodResolver(ResetForgotPasswordSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
    const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: ResetForgotPasswordFormValues) => {
    // console.log("data: ",data)
    setIsLoading(true);
    try {
      const res = await API.post(`/auth/password/reset/${token}`, {
        newPassword: data.password,
      });
      if (res.data.success) {
        ToastSuccess(res.data.message);
      }
      reset();
    } catch (err: any) {
      ToastError(err?.response?.data?.error || "Failed to set password");
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
            Change Password
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="password" className="font-medium text-zinc-300">
                Password
              </label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password.."
                  className="bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white pr-10"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>

                {errors?.password && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              className="w-full text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-lg font-medium transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <BeatLoader color="white" size={10} />
              ) : (
                "Set new password"
              )}
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

export default ResetForgotPassword;
