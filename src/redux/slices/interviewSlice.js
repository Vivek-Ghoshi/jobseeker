import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiInstance from '../../utils/apiInstance';


// Thunks

export const generateInterviewQuestions = createAsyncThunk(
  'interview/generateQuestions',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get('/generate-interview-questions', {
        params: { jobId },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const saveInterviewScores = createAsyncThunk(
  'interview/saveScores',
  async ({ applicationId, scores }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post('/save-interview-scores', {
        applicationId,
        scores,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getApplicationInterviewScores = createAsyncThunk(
  'interview/getApplicationScores',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/application-interview-scores/${applicationId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllScoredApplications = createAsyncThunk(
  'interview/getAllScoredApplications',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/scored-applications/${jobId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    loading: false,
    error: null,
    questions: [],
    scores: [],
    allScoredApplications: [],
    successMessage: null,
  },
  reducers: {
    clearInterviewState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.questions = [];
      state.scores = [];
      state.allScoredApplications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateInterviewQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateInterviewQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(generateInterviewQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(saveInterviewScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveInterviewScores.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Scores saved successfully';
      })
      .addCase(saveInterviewScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getApplicationInterviewScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicationInterviewScores.fulfilled, (state, action) => {
        state.loading = false;
        state.scores = action.payload;
      })
      .addCase(getApplicationInterviewScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllScoredApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllScoredApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.allScoredApplications = action.payload;
      })
      .addCase(getAllScoredApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInterviewState } = interviewSlice.actions;

export default interviewSlice.reducer;
