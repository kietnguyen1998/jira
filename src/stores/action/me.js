import axios from "axios";
import { errorAlert, successAlert } from "../../helpers/swal";
import { createAction } from "./createAction";
import { cybersoftKey, types } from "./types";


export const signIn = (formData,dashboad) => {
    return async (dispatch) =>{
        try{
            const res = await axios({
                url:"https://jiranew.cybersoft.edu.vn/api/Users/signin",
                method:"POST",
                headers:{
                    TokenCybersoft : cybersoftKey.HH_key,
                },
                data:formData,
            })
            dispatch(createAction(types.SET_ME,res.data.content));
            localStorage.setItem("isLogin",res.data.content.accessToken);
            localStorage.setItem("isMeoLoveBe",JSON.stringify(res.data.content));
            
            successAlert("Logged in successfully");
            setTimeout(() => {
                dashboad();
            },2000)
            
        }catch(err){
            errorAlert("Incorrect account or password");
        }
    }
} 

export const checkIsMe = async (dispatch) => {
    try{
        // const res = await axios({
        //     url:"https://jiranew.cybersoft.edu.vn/api/Users/TestToken",
        //     method:"POST",
        //     headers:{
        //         TokenCybersoft:cybersoftKey.HH_key,
        //         Authorization:"Bearer "+ localStorage.getItem("isLogin"),
        //     }
        // })
        // console.log(res);
        const me = JSON.parse(localStorage.getItem("isMeoLoveBe"));
        dispatch(createAction(types.SET_ME,me));
    }catch(err){
        console.log(err);
    }
}

export const logOut = (signin) => {
    return (dispatch) => {
        dispatch(createAction(types.LOG_OUT,""));
        localStorage.removeItem("isLogin");
        successAlert("Logout successfully");
        setTimeout(() => {
            signin();
        },2000)
    }
}
