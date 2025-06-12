import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance, { setAuthToken } from "../../utils/apiInstance";
import { getJobSeekerProfile } from "./jobSeekerSlice";
import { getEmployerProfile } from "./employerSlice";


export const employerSignup = createAsyncThunk(
  "auth/employerSignup",
  async (data,thunkAPI ) => {
    try {
      const res = await apiInstance.post("/auth/signup/employer", data);
       localStorage.setItem("token",res.data.access_token);
       localStorage.setItem("isLoggedIn",true);
       await thunkAPI.dispatch(getEmployerProfile());
      return res.data;
    } catch (err) {
      return console.error(err.res.data);
    }
  }
);

export const jobSeekerSignup = createAsyncThunk(
  "auth/jobSeekerSignup",
  async (data,thunkAPI) => {
    try {
      const res = await apiInstance.post("/auth/signup/job-seeker", data);
       localStorage.setItem("token",res.data.access_token);
       localStorage.setItem("isLoggedIn",true);
       await thunkAPI.dispatch(getJobSeekerProfile());
      return res.data;
    } catch (err) {
      return console.error(err.response?.data || err.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data,thunkAPI) => {
    try {
      const res = await apiInstance.post("/auth/login", data);
      localStorage.setItem("token",res.data.access_token);
      localStorage.setItem("isLoggedIn",true);
       setAuthToken(res.data.access_token);
        if(res.data.role === "job_seeker"){
         await thunkAPI.dispatch(getJobSeekerProfile());
        }else {
         await thunkAPI.dispatch(getEmployerProfile());
        }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null,role:null, loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(employerSignup.pending, (state) => {
        state.loading = true;
      })
      .addCase(employerSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
      })
      .addCase(employerSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(jobSeekerSignup.pending, (state) => {
        state.loading = true;
      })
      .addCase(jobSeekerSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = "jobseeker";
      })
      .addCase(jobSeekerSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
         const rawRole = action.payload.role;
         state.role = rawRole === "job_seeker" ? "jobseeker" : rawRole;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
