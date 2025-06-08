import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../utils/apiInstance";

// ✅ Get Employer Profile
export const getEmployerProfile = createAsyncThunk(
  "employer/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get("/employers/me");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch employer profile"
      );
    }
  }
);

// ✅ Update Employer Profile
export const updateEmployerProfile = createAsyncThunk(
  "employer/updateProfile",
  async (data, thunkAPI) => {
    try {
      const res = await apiInstance.put("/employers/me", data);
      await thunkAPI.dispatch(getEmployerProfile());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// ✅ Create Job
export const createJob = createAsyncThunk(
  "employer/createJob",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiInstance.post("/jobs", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create job"
      );
    }
  }
);

// ✅ Update Job
export const updateJob = createAsyncThunk(
  "employer/updateJob",
  async ({ id, data }) => {
    try {
      const res = await apiInstance.put(`/jobs/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update job"
      );
    }
  }
);

// ✅ Delete Job
export const deleteJob = createAsyncThunk(
  "employer/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiInstance.delete(`/jobs/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete job"
      );
    }
  }
);

// ✅ List Employer Jobs
export const listEmployerJobs = createAsyncThunk(
  "employer/listJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get("/jobs/employer");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to list jobs"
      );
    }
  }
);

// ✅ List Applications For a Job
export const listApplicationsForJob = createAsyncThunk(
  "employer/listApplications",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get(`/applications/employer/job/${jobId}`);
      return res.data;
    } catch (err) {
      console.error("error in fetching applications : ", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to load applications"
      );
    }
  }
);

// ✅ Update Application Status
export const updateApplicationStatus = createAsyncThunk(
  "employer/updateAppStatus",
  async ({ id, data }) => {
    try {
      const res = await apiInstance.put(`/applications/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// ✅ Resume Scoring
export const scoreApplicationResume = createAsyncThunk(
  "employer/scoreResume",
  async (appId, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get(
        `/resume-analysis/applications/${appId}/score`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to score resume"
      );
    }
  }
);

// ✅ Get Applicant Resume by Application ID
export const getApplicantResume = createAsyncThunk(
  "employer/getApplicantResume",
  async (applicationId, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get(
        `/applications/resume/${applicationId}`
      );
      return res.data.resume_url;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applicant resume"
      );
    }
  }
);

// ✅ Get Application by ID
export const getApplication = createAsyncThunk(
  "employer/getApplication",
  async (applicationId, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get(`/applications/${applicationId}`);
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch application"
      );
    }
  }
);

// 🔁 Slice
const employerSlice = createSlice({
  name: "employer",
  initialState: {
    profile: null,
    jobs: [],
    applications: [],
    selectedApplication: null,
    applicantResume: null,
    resumeScore: null,
    workspace: [],
    loading: false,
    error: null,
    scores: [],
  },
  reducers: {
    addQuestion: (state, action) => {
      if (!state.workspace) {
        state.workspace = [];
      }
      state.workspace.push(action.payload);
    },
    removeQuestion: (state, action) => {
      state.workspace.splice(action.payload, 1);
    },
    clearAllQuestions: (state) => {
      state.workspace = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(listEmployerJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(listApplicationsForJob.fulfilled, (state, action) => {
        state.applications = action.payload;
      })
      .addCase(getApplication.fulfilled, (state, action) => {
        state.selectedApplication = action.payload;
      })
      .addCase(getApplicantResume.fulfilled, (state, action) => {
        state.applicantResume = action.payload;
      })
      .addCase(scoreApplicationResume.fulfilled, (state, action) => {
        if (!Array.isArray(state.scores)) {
          state.scores = []; //  ensure safety before push
        }

        const { application_id, score_result } = action.payload;
        const overall_score = score_result?.overall_score;

        const alreadyExists = state.scores.find(
          (item) => item.application_id === application_id
        );

        if (!alreadyExists) {
          state.scores.push({ application_id, overall_score });
        }
        state.resumeScore = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("employer/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("employer/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("employer/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});
export const { addQuestion, removeQuestion, clearAllQuestions } =
  employerSlice.actions;

export default employerSlice.reducer;
