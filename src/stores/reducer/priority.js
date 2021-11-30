import { types } from "../action/types";

const initialState = {
    priorityList:[],
};

const reducer = (state = initialState,{type,payload}) => {
    switch(type){
        case types.GET_ALL_PRIORITY:
            state.priorityList = payload;
            return {...state};
        default:
            return state;
    }
}

export default reducer;