import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import storage from "redux-persist/lib/storage";
// import sotrageSession from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";

// saveUserOnlyFilter
const saveUserOnlyFilter = createFilter("user", ["user"]); // first one -> user object & second one -> key inside user

// Persist config
const persistConfig = {
  key: "user",
  storage,
  // storageSession,
  whitelist: ["user"],
  transforms: [saveUserOnlyFilter],
};

const rootReducer = combineReducers({
  user: userReducer,
});

// Creating persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
  devTools: true,
});

export const persistor = persistStore(store);
