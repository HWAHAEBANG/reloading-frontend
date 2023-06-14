import { SET_USER_INFO, CLEAR_USER_INFO } from "./types";

export const setUserInfoAction = (userInfo) => ({
  type: SET_USER_INFO,
  payload: userInfo,
});
export const clearUserInfoAction = () => ({
  type: CLEAR_USER_INFO,
  payload: null,
});
