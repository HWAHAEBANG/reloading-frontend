import { createStore } from "redux";
import rootReducer from "./rootReducer";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage를 사용할 경우
import storageSession from "redux-persist/lib/storage/session"; // sessionStorage를 사용할 경우

const persistConfig = {
  key: "root",
  // storage: storage,
  storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = createStore(rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { /* default */ store, persistor };
