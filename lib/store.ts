import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./redux/features/authSlice";
import notificationReducer from "./redux/features/notificationSlice";
// import dataReducer from "./redux/features/dataSlice";
import { api } from "../lib/redux/features/baseApi"; // ✅ import your base API

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    // data: dataReducer,
    [api.reducerPath]: api.reducer, // ✅ use the base API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // ✅ add RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
