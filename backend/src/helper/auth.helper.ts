import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";
import { StringValue } from "ms";



export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function isPasswordCorrect(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken() {
  const unHashedToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 day

  return { unHashedToken, hashedToken, tokenExpiry };
}

export function generateTemporaryToken() {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes;

  return { unHashedToken, hashedToken, tokenExpiry };
}

export function generateAccessToken({
  id,
  email,
  username,
  role
}: {
  id: string;
  email: string;
  username: string;
  role:"ADMIN" | "USER"
}) {
  return jwt.sign(
    { id, email, username,role },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY as StringValue }
  );
}

export function generateRefreshToken(id: string) {
  return jwt.sign(
    { id },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY as StringValue }
  );
}
