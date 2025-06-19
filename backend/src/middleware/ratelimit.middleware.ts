import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    statusCode: 429,
    message: "Too many requests. Please try again after 15 minutes.",
    data: null,
    success: false,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    statusCode: 429,
    message:
      "Too many password reset attempts. Please try again after 15 minutes.",
    data: null,
    success: false,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resendEmailRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: {
    statusCode: 429,
    message:
      "Too many resend email verification attempts. Please try again after 30 minutes.",
    data: null,
    success: false,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
