import { types } from "../action/types";

const initialState = "";

const reducer = (state = initialState,{type,payload}) => {
    switch(type){
        case types.SET_ME:
            return state = {...payload};
        case types.LOG_OUT:
            return state = payload;
        default:
            return state;
    }
}

export default reducer;