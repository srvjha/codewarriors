import API from "@/utils/AxiosInstance";
import type { LoginFormValues } from "@/utils/ZodResolver";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { UserData } from "./authTypes";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: FormData,{rejectWithValue}) => {
    try {
      const response = await API.post("/auth/register", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
       return {
        data:response.data.data,
        message:response.data.message
      }
    } catch (error:any) {
        return rejectWithValue(error.response.data.error)
    }
  }
);

export const LoginUser = createAsyncThunk(
  "auth/login",
  async (userData: LoginFormValues,{rejectWithValue}) => {
    try {
      const response = await API.post("/auth/login", userData, {
          withCredentials:true
        });
      return {
        data:response.data.data,
        message:response.data.message
      }
    } catch (error:any) {
        return rejectWithValue(error.response.data.error)
    }
  }
);

export const googleAuthLoginUser = createAsyncThunk(
  "auth/google-auth",
  async (userData: {credential:string},{rejectWithValue}) => {
    try {
      const response = await API.post("/auth/google-auth", userData, {
          withCredentials:true
        });
      return {
        data:response.data.data,
        message:response.data.message
      }
    } catch (error:any) {
        return rejectWithValue(error.response.data.error)
    }
  }
);


export const LogoutUser = createAsyncThunk(
  "auth/logout",
  async(_,{rejectWithValue})=>{
    try {
      const response = await API.get("/auth/logout",{
        withCredentials:true
      });
      return response.data.message
    } catch (error:any) {
      return rejectWithValue(error.response.data.error)
    }
  }
)

export const fetchCurrentUser = createAsyncThunk<UserData>(
  "auth/fetchCurrentUser",
  async(_,{rejectWithValue})=>{
    try {
      const response = await API.get("/auth/me",{
        withCredentials:true
      });
      return response.data.data
    } catch (error:any) {
      return rejectWithValue(error.response.data.error)
    }
  }
)



