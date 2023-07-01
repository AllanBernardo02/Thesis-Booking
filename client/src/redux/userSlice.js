import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user")) || {};
const isLoggedIn = localStorage.getItem("user") !== null;
const initialState = {
  isLoggedIn,
  userProfile: user,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userStatus: (state, { payload }) => {
      state.isLoggedIn = payload;
    },
    userInfo: (state, { payload }) => {
      state.userProfile = payload;
    },
    removeUser: (state) => {
      state.userProfile = {};
    },
    setUser: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { userStatus, userInfo, removeUser, setUser } = userSlice.actions;

export const getStatus = (state) => state.user.isLoggedIn;
export const getUserProfile = (state) => state?.user.userProfile;
export const getUserType = (state) => state.user.userProfile.userType;

export default userSlice.reducer;
