

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import taskReducer from "./taskSlice"

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";


const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  tasks: taskReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(appStore);
export default appStore;
