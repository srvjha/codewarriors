export type UserData = {
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  isEmailVerified: boolean;
};

export interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
  isLoading: boolean;
  isError:boolean;
  message?:string;
  hasFetchedUser: boolean;
}
