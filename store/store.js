import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import userSlice from './slices/userSlice';
import datesSlice from './slices/datesSlice';


const makeStore = () =>
  configureStore({
    reducer: {
        user: userSlice.reducer,
        dates: datesSlice.reducer
    },
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);