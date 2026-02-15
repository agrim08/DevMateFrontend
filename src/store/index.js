import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import feedReducer from "./slices/feedSlice";
import connectionReducer from "./slices/connectionSlice";
import requestReducer from "./slices/requestSlice";
import chatReducer from "./slices/chatSlice";
import uiReducer from "./slices/uiSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer,
    request: requestReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
});

export default appStore;
