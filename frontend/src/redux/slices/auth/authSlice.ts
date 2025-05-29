import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCurrentUser,
  googleAuthLoginUser,
  LoginUser,
  LogoutUser,
  registerUser,
} from "./authThunks";
import type { AuthState } from "./authTypes";

let initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  userData: null,
  isError: false,
  message:"",
  hasFetchedUser: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // register
    builder.addCase(registerUser.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.userData = action.payload.data;
      state.message = action.payload.message;
    });
    builder.addCase(registerUser.rejected, (state, _) => {
      state.isError = true;
      state.isLoading = false;
      // console.log("error aaya hai bhai: ", action.payload);
    });

    // login

    builder.addCase(LoginUser.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.userData = action.payload.data;
      state.message = action.payload.message;
    });
    builder.addCase(LoginUser.rejected, (state,_) => {
      state.isLoading = false;
      state.isError = true;
    });

     // google login

    builder.addCase(googleAuthLoginUser.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(googleAuthLoginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.userData = action.payload.data;
      state.message = action.payload.message;
    });
    builder.addCase(googleAuthLoginUser.rejected, (state,_) => {
      state.isLoading = false;
      state.isError = true;
    });

    // logout
    builder.addCase(LogoutUser.fulfilled, (state, _) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.isLoading = false;
      state.isError = false;
      
    });
    builder.addCase(LogoutUser.rejected, (state, _) => {
      state.isError = true;
      // console.log("error aaya hai bhai: ", action.payload);
    });

    // current user
    builder.addCase(fetchCurrentUser.pending, (state) => {
    state.isLoading = true;
});

    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.userData = action.payload;
      state.hasFetchedUser = true;
     
    });

    builder.addCase(fetchCurrentUser.rejected, (state, _) => {
    state.isLoading = false;
    state.isError = true;
    state.isAuthenticated = false;
    state.hasFetchedUser = true;
    
});

  },
});

export default authSlice.reducer;
