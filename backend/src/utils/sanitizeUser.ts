import { User } from "../generated/prisma";

type SafeUser = Omit<
  User,
  | "password"
  | "refreshToken"
  | "forgotPasswordToken"
  | "forgotPasswordExpiry"
  | "emailVerificationToken"
  | "emailVerificationExpiry"
>;

export function sanitizeUser(user: User): SafeUser {
  const {
    password,
    refreshToken,
    forgotPasswordToken,
    forgotPasswordExpiry,
    emailVerificationToken,
    emailVerificationExpiry,
    ...safeUser
  } = user;

  return safeUser;
}
