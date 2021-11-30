import axios from "axios";
import { createAction } from "./createAction";
import { cybersoftKey, types } from "./types";

export const getStatus = async (dispatch) => {
    try{
        const res = await axios({
            url:"https://jiranew.cybersoft.edu.vn/api/Status/getAll",
            method:"GET",
            headers:{
                TokenCybersoft: cybersoftKey.HH_key,
            }
        })
        dispatch(createAction(types.GET_ALL_STATUS,res.data.content));
    }catch(err){
        console.log(err);
    }
}