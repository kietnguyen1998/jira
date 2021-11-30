import { types } from "../action/types";

const initialState = {
    status:[],
}
const reducer = (state = initialState,{type,payload}) => {
    switch(type){
        case types.GET_ALL_STATUS:
           state.status = payload;
           return {...state};
        default:
            return state;
    }
}

export default reducer;