import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../utils/apiInstance";
import { listAllJobs } from "./jobSeekerSlice";
import axios from "axios";

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

// Thunk to call your AI JD generation API
export const generateJobDescription = createAsyncThunk(
  "job/generateJobDescription",
  async (prompt, { rejectWithValue }) => {
    try {
      const res = await fetch("https://auto.tecosys.ai/webhook/ai-jd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-control-allowed-origin": "*"
        },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to generate job description");

      const data = await res.json();
      
      return data[0].output;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

//thunk for project cost estimation 
export const fetchProjectEstimate = createAsyncThunk(
  "estimate/fetch",
  async (projectData, thunkAPI) => {
    try {
      const res = await fetch("https://auto.tecosys.ai/webhook/cost-estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch project estimate");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err)
      return thunkAPI.rejectWithValue(err.message);
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
  async (id, thunkAPI) => {
    try {
      const res = await apiInstance.delete(`/jobs/${id}`);
      await thunkAPI.dispatch(listAllJobs());
      return id;
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
      console.log(err);
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
      console.log(res);
      return res.data.resume_url;
    } catch (err) {
      console.log(err);
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

export const getJobEvaluations = createAsyncThunk(
  "evaluations/getByJobId",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(
        `/suitability/job/${jobId}/evaluations`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const evaluateApplication = createAsyncThunk(
  "evaluations/evaluateApplication",
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(
        `/suitability/evaluate/${applicationId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
    jobEvaluations: [],
    evaluatedApplication: null,
    jobDetails: null,
    estimatedCost:null,
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
    clearEstimate: (state) => {
      state.estimatedCost = null;
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
       .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
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
      .addCase(getJobEvaluations.fulfilled, (state, action) => {
        state.jobEvaluations = action.payload;
      })
      .addCase(evaluateApplication.fulfilled, (state, action) => {
        state.evaluatedApplication = action.payload;
      })
      .addCase(generateJobDescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateJobDescription.fulfilled, (state, action) => {
        state.loading = false;
        state.jobDetails = action.payload;
      })
      .addCase(generateJobDescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(fetchProjectEstimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectEstimate.fulfilled, (state, action) => {
        state.loading = false;
        state.estimatedCost = action.payload;
      })
      .addCase(fetchProjectEstimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
export const { addQuestion, removeQuestion, clearAllQuestions,clearEstimate } =
  employerSlice.actions;

export default employerSlice.reducer;
