import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    items: [],
    limitReached: false,
  },
  reducers: {
    addFeed: (state, action) => {
      // Ensure we're setting an array for items
      state.items = action.payload || []; 
      state.limitReached = false; // Reset on new feed load
    },
    removeUserFromFeed: (state, action) => {
      state.items = state.items.filter((user) => user?._id !== action.payload);
    },
    setLimitReached: (state, action) => {
      state.limitReached = action.payload;
    },
  },
});

export const { addFeed, removeUserFromFeed, setLimitReached } = feedSlice.actions;
export default feedSlice.reducer;
