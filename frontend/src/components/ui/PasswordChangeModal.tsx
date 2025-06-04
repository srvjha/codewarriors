import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import { X, Eye, EyeOff } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./button";
import { useForm } from "react-hook-form";
import {
  PasswordSchema,
  type PasswordFormValues,
} from "@/utils/ZodResolver";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import API from "@/utils/AxiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";

const PasswordChangeModal = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({ resolver: zodResolver(PasswordSchema) });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field: "old" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = handleSubmit(async (data: PasswordFormValues) => {
    const { oldPassword, newPassword, confirmNewPassword } = data;

    if (newPassword !== confirmNewPassword) {
      ToastError("🔴 Passwords do not match. Please check and try again.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await API.post(
        "auth/password/change",
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      if (res.data.success) {
        reset();
        onClose();
        ToastSuccess(res.data.message);
      }
    } catch (error: any) {
      ToastError(error?.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <Toast />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative w-[90%] max-w-md bg-neutral-900 border border-white/10 rounded-2xl shadow-lg p-6 sm:p-8">
          <button
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>

          <form onSubmit={onSubmit} className="space-y-6">
            <h2 className="text-white text-2xl font-semibold text-center mb-4">
              Change Password
            </h2>

            {/* Old Password */}
            <div className="relative">
              <Input
                {...register("oldPassword")}
                placeholder="Old Password"
                type={showPassword.old ? "text" : "password"}
                className="bg-zinc-800 border border-zinc-700 focus:border-blue-500 text-white w-full pr-10"
              />
              <button
                type="button"
                className="absolute top-2.5 right-3 text-zinc-400 hover:text-white"
                onClick={() => toggleVisibility("old")}
              >
                {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="relative">
              <Input
                {...register("newPassword")}
                placeholder="New Password"
                type={showPassword.new ? "text" : "password"}
                className="bg-zinc-800 border border-zinc-700 focus:border-blue-500 text-white w-full pr-10"
              />
              <button
                type="button"
                className="absolute top-2.5 right-3 text-zinc-400 hover:text-white"
                onClick={() => toggleVisibility("new")}
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                {...register("confirmNewPassword")}
                placeholder="Confirm New Password"
                type={showPassword.confirm ? "text" : "password"}
                className="bg-zinc-800 border border-zinc-700 focus:border-blue-500 text-white w-full pr-10"
              />
              <button
                type="button"
                className="absolute top-2.5 right-3 text-zinc-400 hover:text-white"
                onClick={() => toggleVisibility("confirm")}
              >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            <Button
              className="w-full text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-lg font-medium transition"
              disabled={isLoading}
            >
              {isLoading ? <BeatLoader color="white" size={10} /> : <>Submit</>}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordChangeModal;
