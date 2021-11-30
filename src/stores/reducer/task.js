import { types } from "../action/types";

const initialState = {
   taskTypes:[],
   assignees:[],
   taskDetail:"",
}
const reducer = (state = initialState,{type,payload}) => {
    switch(type){
       
        case types.GET_ALL_TASKTYPE:
            state.taskTypes = payload;
            return {...state};
        case types.GET_ALL_ASSIGNEES:
            state.assignees = payload;
            return {...state};
        case types.GET_TASK_DETAIL:
            state.taskDetail = payload;
            return {...state};
        default:
            return state;
    }
}

export default reducer;