import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  recent: null,
  previous: null
};

export const datesSlice = createSlice({
  name: 'dates',
  initialState,
  reducers: {
    setDates: (state, action) => {
      state.recent = action.payload.recent;
      state.previous = action.payload.previous;
    }
  },
});


export const { setDates } = datesSlice.actions;
// export const recentDate = (state) => state.dates.recent;
// export const previousDate = (state) => state.dates.previous;
export default datesSlice;