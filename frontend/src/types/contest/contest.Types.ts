import type { Problem } from "../problem/problemTypes";

export interface Contest {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  points?: number;
  status: "LIVE" | "UPCOMING" |  "ENDED";
  problems: { order: number; points:number; problem: Problem }[]
}