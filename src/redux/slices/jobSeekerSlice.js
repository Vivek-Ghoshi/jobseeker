import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../utils/apiInstance";


// Get JobSeeker Profile
export const getJobSeekerProfile = createAsyncThunk(
  "jobseeker/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get("/job-seekers/me");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load profile");
    }
  }
);

// Update Basic Profile
export const updateJobSeekerProfile = createAsyncThunk(
  "jobseeker/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiInstance.put("/job-seekers/me", data);
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

// ⏩ Extended Profile Update (for additional fields like skills, experience, etc.)
export const updateJobSeekerProfileExtended = createAsyncThunk(
  "jobseeker/updateProfileExtended",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiInstance.put("/job-seekers/me/profile", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update extended profile");
    }
  }
);

// List All Public Jobs
export const listAllJobs = createAsyncThunk(
  "jobseeker/listJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get("/jobs");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load jobs");
    }
  }
);

// Get Single Job by ID
export const getJob = createAsyncThunk(
  "jobseeker/getJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get(`/jobs/${jobId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load job details");
    }
  }
);

// Create a Job Application
export const createApplication = createAsyncThunk(
  "jobseeker/createApplication",
  async (applicationData, { rejectWithValue }) => {
    try {
      const res = await apiInstance.post("/applications", applicationData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to apply for job");
    }
  }
);

// Get All Applications Made by Jobseeker
export const listJobSeekerApplications = createAsyncThunk(
  "jobseeker/applications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get("/applications/job-seeker");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load applications");
    }
  }
);

const jobSeekerSlice = createSlice({
  name: "jobseeker",
  initialState: {
    profile: null,
    jobs: [],
    selectedJob: null,
    applications: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobSeekerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateJobSeekerProfileExtended.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(listAllJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(getJob.fulfilled, (state, action) => {
        state.selectedJob = action.payload;
      })
      .addCase(listJobSeekerApplications.fulfilled, (state, action) => {
        state.applications = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("jobseeker/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("jobseeker/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("jobseeker/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default jobSeekerSlice.reducer;
