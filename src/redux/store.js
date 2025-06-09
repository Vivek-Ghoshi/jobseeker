import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '../redux/slices/authSlice';
import employerReducer from '../redux/slices/employerSlice';
import jobSeekerReducer from '../redux/slices/jobSeekerSlice';
import textToSpeechReducer from '../redux/slices/textToSpeechSlice';
import resumeBuilderReducer from '../redux/slices/resumeBuilderSlice';
import interviewReducer from "../redux/slices/interviewSlice";
import candidateVerificationReducer from '../redux/slices/candidateVerificationSlice';


// Persist config only for 'auth'
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['auth','employer','jobseeker','textToSpeech','resumeBuilder','interview','candidateVerification'],
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer, 
  employer: employerReducer,
  jobseeker: jobSeekerReducer,
  textToSpeech: textToSpeechReducer,
  resumebuilder: resumeBuilderReducer,
  interview: interviewReducer,
  candidateVerification:candidateVerificationReducer 
});
const persistedRootReducer = persistReducer(persistConfig, rootReducer);
// Create store
const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

const persistor = persistStore(store);
export default store;
export { store, persistor };
