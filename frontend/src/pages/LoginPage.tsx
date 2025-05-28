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
import { Code, Brain, Trophy, Zap, LogIn, EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { LoginFormValues } from "@/utils/ZodResolver";
import { LoginResolver } from "@/utils/ZodResolver";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { LoginUser } from "@/redux/slices/auth/authThunks";

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

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading} = useSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({ resolver: LoginResolver });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const onSubmit = handleSubmit(async (data: LoginFormValues) => {
    await LoginUserFunction(data);
  });

  const LoginUserFunction = async (userInfo: LoginFormValues) => {
    const result = await dispatch(LoginUser(userInfo));
    if (LoginUser.fulfilled.match(result)) {
      ToastSuccess(result.payload.message);
      setTimeout(() => {
        reset();
        navigate("/");
      }, 3000);
    } else {
      ToastError(`${result.payload}`);
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
              <Link to="/">
                <h2 className="text-xl font-bold text-blue-400 cursor-pointer">
                  CodeWarrior
                </h2>
              </Link>
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
            <Card className="w-full max-w-md bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 shadow-xl rounded-xl py-10 px-8 text-zinc-200">
              <CardHeader>
                <CardTitle className="text-3xl text-white">Sign In</CardTitle>
                <CardDescription className="text-base font-normal text-zinc-400">
                  Return to your coding battles and challenges
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form className="mt-4" onSubmit={onSubmit}>
                  <div className="grid w-full items-center gap-5">
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

                    <div className="flex items-center justify-start">
                      
                      <Link
                        to="/forgot-password"
                        className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Button
                      className="w-full text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-6 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <BeatLoader />
                      ) : (
                        <>
                          <LogIn className="mr-2 w-5 h-5" />
                          Access Your Account
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 mt-4">
                <p className="text-sm text-center text-zinc-400 mt-2">
                  Not a CodeWarrior yet?{" "}
                  <Link
                    to="/register"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Join the arena
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

export default LoginPage;
