import { LOGIN, LOGOUT } from "./types";

const initialState = {
  isLoggedIn: false,
};

export const isLoggedInReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, isLoggedIn: true };
    case LOGOUT:
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
};
