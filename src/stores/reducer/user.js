import { types } from "../action/types";

const initialState = {
  users: {},
  userSearch:""
};
const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.FET_USER:
      state.users = payload;
      return {...state};
      case types.FET_USER_SEARCH:
      state.userSearch = payload;
      return {...state};
    default:
      return state;
  }
};
 export default reducer;