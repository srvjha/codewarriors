
import { OAuth2Client } from "google-auth-library";
import { env } from "./env";
import { ApiError } from "./ApiError";

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
// console.log("client: ",client)

export const verifyGoogleToken = async (credential: string) => {
  if (!credential) {
    throw new ApiError("Google credential is required",400);
  }

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new ApiError("Invalid Google token",400);
  }

  if (!payload) {
    throw new ApiError(
      "Google token verification failed, No payload received",
      400
    );
  }

  return payload;
};