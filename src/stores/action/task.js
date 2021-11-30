import axios from "axios";
import { createAction } from "./createAction";
import { cybersoftKey, types } from "./types";


export const getTaskType = async(dispatch) => {
    try{
        const res = await axios({
            url:"https://jiranew.cybersoft.edu.vn/api/TaskType/getAll",
            method:"GET",
            headers:{
                TokenCybersoft: cybersoftKey.HH_key,
            }
        })
        dispatch(createAction(types.GET_ALL_TASKTYPE,res.data.content));
    }catch(err){
        console.log(err);
    }
}
export const getTaskDetail = (taskId) => {
    return async dispatch => {
        try{
            const res = await axios({
                url:"https://jiranew.cybersoft.edu.vn/api/Project/getTaskDetail",
                method:"GET",
                params:{
                    taskId,
                },
                headers:{
                    Authorization:"Bearer "+localStorage.getItem("isLogin"),
                    TokenCybersoft: cybersoftKey.HH_key,
                }
            })
            dispatch(createAction(types.GET_TASK_DETAIL,res.data.content))

        }catch(err){
            console.log(err);
        }
    }
}
export const getAssignees = (idProject) => {
    return async(dispatch) => {
        try{
            const res = await axios({
                url:"https://jiranew.cybersoft.edu.vn/api/Users/getUserByProjectId",
                method:"GET",
                params:{
                    idProject,
                },
                headers:{
                    Authorization:"Bearer "+localStorage.getItem("isLogin"),
                    TokenCybersoft: cybersoftKey.HH_key,
                }
            })
            dispatch(createAction(types.GET_ALL_ASSIGNEES,res.data.content))
            
        }catch(err){
            console.log(err);
            dispatch(createAction(types.GET_ALL_ASSIGNEES,[]))
        }
    }
}

