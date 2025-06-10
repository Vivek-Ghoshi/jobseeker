import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../utils/apiInstance";


// Upload Resume
export const uploadResume = createAsyncThunk(
  "resume/upload",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiInstance.post("/file-upload/resume", data);
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

// Get Resume URL
export const getResumeURL = createAsyncThunk(
  "resume/getURL",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get("/file-upload/resume");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "URL fetch failed");
    }
  }
);

// Create Resume
export const createResume = createAsyncThunk(
  "resume/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiInstance.post("/resume-builder/create", data); 
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(
        err.response?.data?.message || "Resume creation failed"
      );
    }
  }
);

// ✅ List Resume Templates
export const listResumeTemplates = createAsyncThunk(
  "resume/listTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get("/resume-builder/templates/list");
      return res.data.templates;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load templates"
      );
    }
  }
);

// ✅ Get Resume By ID
export const getResume = createAsyncThunk(
  "resume/getById",
  async (resumeId, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get(`/resume/${resumeId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch resume"
      );
    }
  }
);

// ✅ Delete Resume By ID
export const deleteResume = createAsyncThunk(
  "resume/delete",
  async (resumeId, { rejectWithValue }) => {
    try {
     const res = await apiInstance.delete(`/resume-builder/${resumeId}`);
      return resumeId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete resume"
      );
    }
  }
);

// ✅ Generate PDF Blob
export const resumePdfFromBlob = createAsyncThunk(
  "resume/pdfBlob",
  async (resumeId, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get(`/resume/pdf/${resumeId}`, {
        responseType: "blob", // PDF as blob
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      return url;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get PDF"
      );
    }
  }
);

export const getUserResumes = createAsyncThunk(
  "resume/getUserResumes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get("/resume-builder/list");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user resumes"
      );
    }
  }
);

// Initial State
const initialState = {
  resumes: [],
  templates: [],
  pdfURL: null,
  uploadedResumeUrl:null,
  resumeDetails:null,
  loading: false,
  error: null,
};

const resumeBuilderSlice = createSlice({
  name: "resumeBuilder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Resume
      .addCase(createResume.fulfilled, (state, action) => {
        state.resumes.push(action.payload);
      })

      // List Templates
      .addCase(listResumeTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
      })
      .addCase(uploadResume.fulfilled,(state,action)=>{
         state.resumeDetails = action.payload;
      })
      //get resume url uploaded
      .addCase(getResumeURL.fulfilled,(state,action)=>{
        state.uploadedResumeUrl = action.payload;
      })
      // Get Resume
      .addCase(getResume.fulfilled, (state, action) => {
        const existing = state.resumes.find(
          (r) => r._id === action.payload._id
        );
        if (!existing) state.resumes.push(action.payload);
      })
        
      // Delete Resume
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r.id !== action.payload);
      })

      // Resume PDF URL from Blob
      .addCase(resumePdfFromBlob.fulfilled, (state, action) => {
        state.pdfURL = action.payload;
      })
      .addCase(getUserResumes.fulfilled, (state, action) => {
        state.resumes = action.payload;
      })
      // Common matchers
      .addMatcher(
        (action) =>
          action.type.startsWith("resume") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("resume") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("resume") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default resumeBuilderSlice.reducer;
