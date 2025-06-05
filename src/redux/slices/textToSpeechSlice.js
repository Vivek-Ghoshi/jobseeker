import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../utils/apiInstance";

// 1. Get TTS Audio URL
export const getTTSAudio = createAsyncThunk(
  "tts/getAudio",
  async ({ promptPath, language }, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get(`/tts/tts-audio`, {
        params: { prompt_path: promptPath, language },
      });
      return res.data; // { audio_url, language, prompt_path }
    } catch (err) {
      console.log(err)
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch TTS audio."
      );
    }
  }
);

// 2. Get Available Prompts
export const getAvailablePrompts = createAsyncThunk(
  "tts/getPrompts",
  async ({ language }, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get(`/tts/available-prompts`, {
        params: { language },
      });
      return res.data; // Array of prompts
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch prompts."
      );
    }
  }
);

// 3. Get Available Languages
export const getAvailableLanguages = createAsyncThunk(
  "tts/getLanguages",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiInstance.get(`/tts/available-languages`);
      return res.data; // Array of languages
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch languages."
      );
    }
  }
);

const textToSpeechSlice = createSlice({
  name: "textToSpeech",
  initialState: {
    audioData: null,
    prompts: [],
    languages: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTTSAudio.fulfilled, (state, action) => {
        state.audioData = action.payload;
      })
      .addCase(getAvailablePrompts.fulfilled, (state, action) => {
        state.prompts = action.payload;
      })
      .addCase(getAvailableLanguages.fulfilled, (state, action) => {
        state.languages = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("tts/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("tts/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("tts/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default textToSpeechSlice.reducer;
