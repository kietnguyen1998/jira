import axios from "axios";
import { createAction } from "./createAction";
import { cybersoftKey, types } from "./types";

export const getComment = (taskId) => {
  return async (dispatch) => {
    try {
      const res = await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Comment/getAll",
        method: "GET",
        params: {
          taskId,
        },
        headers: {
          TokenCybersoft: cybersoftKey.PM_key,
        },
      });
      console.log(res);
      dispatch(createAction(types.GET_COMMENT, res.data.content));
    } catch (err) {
        console.log(err);
    }
  };
};
