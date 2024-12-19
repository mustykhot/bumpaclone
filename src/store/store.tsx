import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "services/auth.api";
import { generalApi } from "services";
import { messengerApi } from "services/messenger.api";
// import uuid from "react-uuid";

// const tabKey = `tab1`;
// const persistKey = `root_${tabKey}`;

const persistConfig = {
  // key: persistKey,
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "bulkProduct"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(generalApi.middleware)
      .concat(messengerApi.middleware),
});

export const persistor = persistStore(store);

export default store;
