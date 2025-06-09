import { createSlice } from "@reduxjs/toolkit";

const candidateVerificationSlice = createSlice({
  name: "candidateVerification",
  initialState: {
    uploadedImage: null,
    cameraActive: false,
  },
  reducers: {
    setUploadedImage: (state, action) => {
      state.uploadedImage = action.payload;
    },
     setCameraStatus: (state, action) => {
      state.cameraActive = action.payload;
    },
  },
});

export const { setUploadedImage,setCameraStatus } = candidateVerificationSlice.actions;
export default candidateVerificationSlice.reducer;
