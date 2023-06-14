import { combineReducers } from "redux";
import { isLoggedInReducer } from "./is-logged-in/reducer";
import { userInfoReducer } from "./user-info/reducer";

const rootReducer = combineReducers({
  isLoggedIn: isLoggedInReducer,
  userInfo: userInfoReducer,
});

export default rootReducer;
