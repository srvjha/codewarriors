import { env } from "../utils/env";

 export const headers = {
    Authorization: `Bearer ${process.env.JUDGE0_API_KEY}`, 
    "Content-Type": "application/json",
  };