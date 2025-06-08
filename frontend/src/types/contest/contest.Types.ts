
export interface Contest {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: "LIVE" | "UPCOMING" |  "ENDED";
  problem:{
    id: string;
  }[]
}