import { types } from "../action/types";

const initialState = {

  projects: [],
  categorys: [],
  userProjects: [],
  projectsDetail:"",
  
};
const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.GET_ALL_PROJECT:
           state.projects = payload;
           return {...state};
    case types.FET_PROJECT:
      state.projects = payload;
      return { ...state };
    case types.GET_CATEGORY:
      state.categorys = payload;
      return { ...state };
    case types.FETUSER_PROJECT:
      state.userProjects = payload;
      return { ...state };
    case types.GET_DETAIL_PROJECT:
           state.projectsDetail = payload;
           return {...state};
    default:
      return state;
  }
};
export default reducer;

