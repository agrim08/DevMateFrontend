import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    isLoading: true,
  },
  reducers: {
    addUser: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    removeUser: (state) => {
      state.data = null;
      state.isLoading = false;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;