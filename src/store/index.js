import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
// import { persistStore } from "redux-persist";

// TODO: store to be added
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "root",
//   storage
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const reducerList = combineReducers(reducers);
let store = createStore(reducerList, applyMiddleware(thunk));

/** configure persist store if required */
// persistStore(store);

export default function configureStore() {
  return store;
}
