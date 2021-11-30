import axios from "axios";
import { createAction } from "./createAction";
import { cybersoftKey, types } from "./types";

export const fetchUser = (keyWord) => {
  return async (dispatch) => {
    try {
      const res = await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Users/getUser",
        method: "GET",
        headers: {
          TokenCybersoft: cybersoftKey.PM_key,
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
        },
        params: { keyWord },
      });
      dispatch(createAction(types.FET_USER, res.data.content));
     
    } catch (err) {
      console.log(err);
    }
  };
};

export const fetchUserSearch = (keyWord) => {
  return async (dispatch) => {
    try {
      const res = await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Users/getUser",
        method: "GET",
        headers: {
          TokenCybersoft: cybersoftKey.PM_key,
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
        },
        params: { keyWord },
      });
      dispatch(createAction(types.FET_USER_SEARCH, res.data.content));
     
    } catch (err) {
      console.log(err);
    }
  };
};
