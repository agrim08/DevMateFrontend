import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    unreadCounts: {}, // userId -> count
    onlineUsers: [], // list of userIds
    activeChat: null, // userId of the currently open chat
    lastMessageTimestamps: {}, // userId -> timestamp
  },
  reducers: {
    updateLastMessageAt: (state, action) => {
      const { userId, timestamp } = action.payload;
      state.lastMessageTimestamps[userId] = timestamp;
    },
    incrementUnread: (state, action) => {
      const senderId = action.payload;
      // Don't increment if we are currently chatting with this user
      if (state.activeChat === senderId) return;
      
      state.unreadCounts[senderId] = (state.unreadCounts[senderId] || 0) + 1;
      state.lastMessageTimestamps[senderId] = new Date().toISOString();
    },
    clearUnread: (state, action) => {
      const userId = action.payload;
      state.unreadCounts[userId] = 0;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      if (status === "online") {
        if (!state.onlineUsers.includes(userId)) {
          state.onlineUsers.push(userId);
        }
      } else {
        state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
      }
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      if (action.payload) {
        state.unreadCounts[action.payload] = 0;
      }
    }
  },
});

export const { 
  incrementUnread, 
  clearUnread, 
  setOnlineUsers, 
  updateUserStatus,
  setActiveChat,
  updateLastMessageAt
} = chatSlice.actions;

export default chatSlice.reducer;
