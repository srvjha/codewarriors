import { z } from "zod";

const envSchema = z.object({
  VITE_GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
  VITE_DEV_ENV: z.string().url("DEV_ENV must be a valid URL"),
  VITE_PROD_ENV: z.string().url("PROD_ENV must be a valid URL"),
  VITE_LOGO_DEV_PUBLIC_KEY: z
    .string()
    .min(1, "Logo Dev public key is required"),
});
const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsedEnv.error.format(), null, 2),
  );
  throw new Error(
    "Invalid environment variables. Check the console for details.",
  );
}

const env = parsedEnv.data;

export default env;
