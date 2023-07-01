import { createSlice } from "@reduxjs/toolkit";

const customizationSlice = createSlice({
  name: "customization",
  initialState: { backgroundColor: "#005555" },
  reducers: {
    setBackgroundColor: (state, action) => {
      state.backgroundColor = action.payload;
    },
  },
});

export const { setBackgroundColor } = customizationSlice.actions;
export default customizationSlice.reducer;
