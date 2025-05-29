import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Code,
  Brain,
  Trophy,
  Zap,
  ChevronRight,
  EyeOff,
  Eye,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { FormValues } from "@/utils/ZodResolver";
import { resolver } from "@/utils/ZodResolver";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { registerUser } from "@/redux/slices/auth/authThunks";
import type { AppDispatch } from "@/redux/store";
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const featureItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
 const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = handleSubmit(async (data: FormValues) => {
   const formData = new FormData();
    formData.append("username", data.username);
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.avatar && data.avatar?.[0]) {
      formData.append("avatar", data.avatar[0]);
    }
    await registerUserFunction(formData);
  });

  const registerUserFunction = async (userInfo: FormData) => {
    try{
       setIsLoading(true);
    const result = await dispatch(registerUser(userInfo)).unwrap();
      ToastSuccess(result.message);
      setTimeout(() => {
        reset();
        navigate(from, { replace: true });
      }, 3000);
    } catch(error:any) {
      ToastError(
        error || error?.response?.data?.message || "Something went wrong"
      )
    }finally{
       setIsLoading(false);
    }
  };

  return (
    <>
      <Toast />
      <div className="min-h-screen flex items-center justify-center  px-4">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            className="text-center md:text-left space-y-8 px-2 md:px-8"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Code className="text-blue-500 w-8 h-8" />
              <h2 className="text-xl font-bold text-blue-400">CodeWarrior</h2>
            </div>

            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Level Up Your{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Coding Skills
              </span>
            </h1>

            <p className="text-lg text-zinc-300 leading-relaxed">
              Master challenging algorithms, compete with peers, and build your
              developer profile in our AI-powered coding arena. Are you ready to
              become a legendary CodeWarrior?
            </p>

            <motion.ul
              className="space-y-4 text-zinc-200 pt-2"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.li variants={featureItem} className="flex items-center">
                <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <span>AI-powered code analysis and feedback</span>
              </motion.li>

              <motion.li variants={featureItem} className="flex items-center">
                <div className="bg-purple-500/10 p-2 rounded-lg mr-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <span>Adaptive learning paths for continuous growth</span>
              </motion.li>

              <motion.li variants={featureItem} className="flex items-center">
                <div className="bg-cyan-500/10 p-2 rounded-lg mr-3">
                  <Trophy className="w-5 h-5 text-cyan-400" />
                </div>
                <span>Compete in global leaderboards and tournaments</span>
              </motion.li>
            </motion.ul>
          </motion.div>

          {/* Right Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card className="mx-auto w-full max-w-md bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 shadow-xl rounded-xl py-6 px-8 text-zinc-200">
              <CardHeader>
                <CardTitle className="text-3xl text-white">
                  Join the Arena
                </CardTitle>
                <CardDescription className="text-base font-normal text-zinc-400">
                  Become a Code Warrior and rule the coding game
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form className="mt-4" onSubmit={onSubmit}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor="email"
                        className="font-medium text-zinc-300"
                      >
                        Username
                      </label>
                      <Input
                        {...register("username")}
                        placeholder="Enter Your Username.."
                        className="bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                      />
                      {errors?.username && (
                        <p className="text-red-500">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor="name"
                        className="font-medium text-zinc-300"
                      >
                        Full Name
                      </label>
                      <Input
                        {...register("fullName")}
                        placeholder="Enter Your Full Name.."
                        className="bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                      />
                      {errors?.fullName && (
                        <p className="text-red-500">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor="email"
                        className="font-medium text-zinc-300"
                      >
                        Email
                      </label>
                      <Input
                        {...register("email")}
                        placeholder="Enter Your Email.."
                        className="bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                      />
                      {errors?.email && (
                        <p className="text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor="password"
                        className="font-medium text-zinc-300"
                      >
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
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </span>

                        {errors?.password && (
                          <p className="text-red-500 mt-1 text-sm">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor="password"
                        className="font-medium text-zinc-300"
                      >
                        Avatar
                      </label>
                      <Input
                        {...register("avatar")}
                        type="file"
                        placeholder="Choose avatar"
                        className="bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full text-base bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-500 hover:to-blue-400  text-white py-6 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <BeatLoader />
                      ) : (
                        <>
                          Create Warrior Profile
                          <ChevronRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 mt-6">
                <p className="text-sm text-center text-zinc-400">
                  Already a CodeWarrior?{" "}
                  <Link
                    to="/login"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
