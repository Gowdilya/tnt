import { configureStore } from '@reduxjs/toolkit';
import prepareDataReducer from '../components/PrepareData/reducers/prepareDataSlice';

export const store = configureStore({
  reducer: {
    prepareData: prepareDataReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,// TURN OFF non serializable redux error in console log when storing file data in redux state
  }),
});