import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const createEnv = (env: NodeJS.ProcessEnv) => {
  const envSchema = z.object({
    PORT: z.coerce.number(),
    DATABASE_URL: z.string().nonempty(),
    RESEND_API_KEY:z.string().nonempty(),

    MAILTRAP_SMTP_HOST: z.string().nonempty(),
    MAILTRAP_SMTP_PORT: z.coerce.number(),
    MAILTRAP_SMTP_USER: z.string().nonempty(),
    MAILTRAP_SMTP_PASS: z.string().nonempty(),
    MAIL_FROM: z.string().nonempty(),

    MAX_ATTACHMENTS: z.coerce.number(),
    BASE_URI: z.string(),

    ACCESS_TOKEN_SECRET: z.string().nonempty(),
    ACCESS_TOKEN_EXPIRY: z.string().default("5m"),

    REFRESH_TOKEN_SECRET: z.string().nonempty(),
    REFRESH_TOKEN_EXPIRY: z.string().default("7d"),

    CLOUDINARY_CLOUD_NAME: z.string().nonempty(),
    CLOUDINARY_API_KEY: z.string().nonempty(),
    CLOUDINARY_API_SECRET: z.string().nonempty(),

    JUDGE0_API_URL: z.string().nonempty(),
    JUDGE0_API_KEY: z.string().nonempty(),
    GOOGLE_CLIENT_ID: z.string().nonempty(),
    GEMINI_API_KEY:z.string().nonempty()
  });

  const validationResult = envSchema.safeParse(env);

  if (validationResult.success) {
    return validationResult.data;
  } else {
    const errorMessage = validationResult.error.errors
      .map((err) => `${err.path.join(".")} :  ${err.message}`)
      .join(", ");

    throw new Error(errorMessage);
  }
};

const env = createEnv(process.env);
export { env };
