import { PrismaClient, User } from "@prisma/client";

export type CustomUser = Pick<
  User,
  "id" | "username" | "email" | "role"
>;

declare global {
  var prisma: PrismaClient | undefined;

  namespace Express {
    interface Request {
      user: CustomUser;
    }
  }
}
