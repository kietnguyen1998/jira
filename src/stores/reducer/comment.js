import { types } from "../action/types";

const initialState = {
  comments: [],
};
const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.GET_COMMENT:
      state.comments = payload;
      return { ...state };
    default:
      return state;
  }
};
export default reducer;