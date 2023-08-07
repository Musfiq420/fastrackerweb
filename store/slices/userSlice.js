import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  profile: null
};



export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    }

    // Special reducer for hydrating the state
    // extraReducers: {
    //   [HYDRATE]: (state, action) => {
    //     return {
    //       ...state,
    //       ...action.payload.comments,
    //     };
    //   },
    // },
  },
});

export const { setLoggedIn, setUsername } = userSlice.actions;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectUserName = (state) => state.user.username;
export default userSlice;