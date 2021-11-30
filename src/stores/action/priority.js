import axios from "axios";
import { cybersoftKey, types } from "./types";
import {createAction} from './createAction'

export const getAllPriority = (id) => {
    return async (dispatch) => {
        try{
            const res = await axios({
                url:"https://jiranew.cybersoft.edu.vn/api/Priority/getAll",
                method:"GET",
                params:{
                    id,
                },
                headers:{
                    
                    TokenCybersoft: cybersoftKey.HH_key,
                }
               
            })
            dispatch(createAction(types.GET_ALL_PRIORITY,res.data.content));
           
        }catch(err){
            console.log(err);
        }
    }
}
