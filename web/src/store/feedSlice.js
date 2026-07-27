import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    users: [],
    isLoading: false,
  },
  reducers: {
    setFeed: (state, action) => {
      state.users = action.payload;
      state.isLoading = false;
    },
    removeUserFromFeed: (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },
    setFeedLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setFeed, removeUserFromFeed, setFeedLoading } =
  feedSlice.actions;
export default feedSlice.reducer;
