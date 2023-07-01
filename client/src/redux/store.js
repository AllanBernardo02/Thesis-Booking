import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { alertsSlice } from "./alertsSlice";
import { userSlice } from "./userSlice";
import customizationSlice from "./customizationSlice";

const rootReducer = combineReducers({
  alerts: alertsSlice.reducer,
  user: userSlice.reducer,
  customization: customizationSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
