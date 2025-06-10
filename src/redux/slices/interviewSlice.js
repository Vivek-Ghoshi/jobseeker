import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../utils/apiInstance";

// Thunks

export const generateInterviewQuestions = createAsyncThunk(
  "interview/generateQuestions",
  async (appId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(
        `/interview-questions/generate/${appId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const scheduleInterview = createAsyncThunk(
  "schedule/interview",
  async (details) => {
    try {
      const res = await apiInstance.post(`/meetings`, details);
      return res.data.questions;
    } catch (err) {
      console.error("Failed to generate meeting link", err);
    }
  }
);
export const MeetingsList = createAsyncThunk("interview/list", async (jobId) => {
  try {
    const res = await apiInstance.get(`/meetings`,{
      params:{
        job_id: jobId,
      }
    });
    return res.data;
  } catch (err) {
    console.error("Failed to generate meeting link", err);
  }
});

// Update meeting status (e.g., mark as COMPLETED)
export const updateMeeting = createAsyncThunk(
  "meeting/updateMeeting",
  async ({ meetingId, value }, thunkAPI) => {
    try {
      console.log(meetingId,value);
      const res = await apiInstance.patch(`/meetings/${meetingId}`, {
        status: value,
      });
      console.log(res);
      await thunkAPI.dispatch(MeetingsList());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

// Cancel meeting (status to CANCELLED)
export const cancelMeeting = createAsyncThunk(
  "meeting/cancelMeeting",
  async (meetingId) => {
    try {
      console.log(meetingId);
      const res = await apiInstance.post(`/meetings/${meetingId}/cancel`);
      console.log(res);
      return res.data;
    } catch (err) {
      return console.error(err.response?.data?.message || "Cancel failed");
    }
  }
);
export const getMeeting = createAsyncThunk("get-meeting", async (meetingId) => {
  try {
    const res = await apiInstance.get(`/meetings/${meetingId}`);
    return res.data;
  } catch (err) {
    return console.error(err.response?.data?.message || "Cancel failed");
  }
});

export const saveInterviewScores = createAsyncThunk(
  "interview/saveScores",
  async ({ data, appId }, thunkAPI) => {
    try {
      console.log(data)
      const response = await apiInstance.post(`/interview-questions/score/${appId}`, data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Submission failed");
    }
  }
);

export const getReportCard = createAsyncThunk(
  "interview/getApplicationScores",
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(
        `/interview-questions/${applicationId}`
      );
      return response.data.meeting_id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllScoredApplications = createAsyncThunk(
  "interview/getAllScoredApplications",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(
        `/interview-questions/job/${jobId}/scores`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createTimeSlots = createAsyncThunk(
  "timeSlots/create",
  async (payload, thunkAPI) => {
    try {
      const res = await apiInstance.post("/time-slots", payload);
      return res.data;
    } catch (err) {
      console.error("Create TimeSlots Error:", err.message);
      return null;
    }
  }
);

// 2. GET - List Available Time Slots
export const listTimeSlots = createAsyncThunk(
  "timeSlots/list",
  async (jobId, thunkAPI) => {
    try {
      const res = await apiInstance.get("/time-slots",{
        params:{
          job_id:jobId
        }
      });
      return res.data.time_slots;
    } catch (err) {
      console.error("List TimeSlots Error:", err.message);
      return [];
    }
  }
);

// 3. POST - Select Time Slot
export const selectTimeSlot = createAsyncThunk(
  "timeSlots/select",
  async (timeSlotId) => {
    try {
      const res = await apiInstance.post(
        `/time-slots/${timeSlotId}/select`
      );
      return res.data;
    } catch (err) {
      console.error("Select TimeSlot Error:", err.message);
      return null;
    }
  }
);

// 4. POST - Cancel Time Slot
export const cancelTimeSlot = createAsyncThunk(
  "timeSlots/cancel",
  async (timeSlotId) => {
    try {
      const res = await apiInstance.post(
        `/time-slots/${timeSlotId}/cancel`
      );
      return { ...res.data, timeSlotId };
    } catch (err) {
      console.error("Cancel TimeSlot Error:", err.message);
      return null;
    }
  }
);

// Slice

const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    loading: false,
    error: null,
    questions: [],
    scores: [],
    allScoredApplications: [],
    successMessage: null,
    meetingsData: [],
    currentMeeting: null,
    timeSlots: [],
    selectedTimeSlot:null
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
      .addCase(updateMeeting.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload; // Ensure this contains meeting_id

        if (state.meetingsData && Array.isArray(state.meetingsData.meetings)) {
          state.meetingsData.meetings = state.meetingsData.meetings.map(
            (meeting) =>
              meeting.meeting_id === updated.meeting_id
                ? { ...meeting, status: "COMPLETED" }
                : meeting
          );
        }
      })

      .addCase(MeetingsList.fulfilled, (state, action) => {
        state.meetingsData = action.payload;
      })
      .addCase(getMeeting.fulfilled, (state, action) => {
        state.currentMeeting = action.payload;
      })
      .addCase(cancelMeeting.fulfilled, (state, action) => {
        const cancelled = action.payload;
  
        if (state.meetingsData && Array.isArray(state.meetingsData.meetings)) {
          state.meetingsData.meetings = state.meetingsData.meetings.filter(
            (meeting) => meeting?.meeting_id !== cancelled.meeting_id
          );
        }
      })
      .addCase(saveInterviewScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveInterviewScores.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Scores saved successfully";
      })
      .addCase(saveInterviewScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getReportCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReportCard.fulfilled, (state, action) => {
        state.loading = false;
        state.scores = action.payload;
      })
      .addCase(getReportCard.rejected, (state, action) => {
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
      })

      .addCase(createTimeSlots.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.timeSlots = action.payload;
        }
      })

      .addCase(listTimeSlots.fulfilled, (state, action) => {
        state.timeSlots = action.payload || [];
      })

      // Select Time Slot
      .addCase(selectTimeSlot.fulfilled, (state, action) => {
        if (action.payload) {
           state.selectedTimeSlot = action.payload.meeting.meeting_id;
        }
      })

      // Cancel Time Slot
      .addCase(cancelTimeSlot.fulfilled, (state, action) => {
        if (action.payload) {
          const slot = state.timeSlots.find(
            (slot) => slot.id === action.payload.timeSlotId
          );
          if (slot) slot.status = "CANCELLED";
        }
      });
  },
});

export const { clearInterviewState } = interviewSlice.actions;

export default interviewSlice.reducer;
