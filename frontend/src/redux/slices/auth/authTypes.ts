export type UserData = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  isEmailVerified: boolean;
  dailyProblemStreak: number;
  lastSubmissionDate: string | null;
};

export interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
  isLoading: boolean;
  isError: boolean;
  message?: string;
  hasFetchedUser: boolean;
}
