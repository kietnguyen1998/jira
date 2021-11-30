

import axios from "axios";
import { errorAlert, successAlert } from "../../helpers/swal";
import { createAction } from "./createAction";
import { cybersoftKey, types } from "./types";
export const getAllProject = async (dispatch) => {
  try{
      const res = await axios({
          url:"https://jiranew.cybersoft.edu.vn/api/Project/getAllProject",
          method:"GET",
          headers:{
              Authorization:"Bearer "+ localStorage.getItem("isLogin"),
              TokenCybersoft: cybersoftKey.HH_key,
          }
         
      })
      dispatch(createAction(types.GET_ALL_PROJECT,res.data.content));
     
  }catch(err){
      console.log(err);
  }
}
export const fetchProject = (keyword) => {
  return async (dispatch) => {
    try {
      const res = await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/getAllProject",
        method: "GET",
        params: {
          keyword,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.PM_key,
        },
      });
      dispatch(createAction(types.FET_PROJECT, res.data.content));
    
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteProject = (projectId) => {
  return async (dispatch) => {
    try {
      const res = await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/deleteProject",
        method: "DELETE",
        params: { projectId },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.PM_key,
        },
      });
      dispatch(createAction(types.DELETE_PROJECT, res.data.content));
      successAlert("Delete in successfully");
    } catch (err) {
      const showErr = { ...err };
      console.log(showErr);
      errorAlert(showErr.response.data.message);
    }
  };
};
export const getCategory = async (dispatch) => {
  try {
    const res = await axios({
      url: "https://jiranew.cybersoft.edu.vn/api/ProjectCategory",
      method: "GET",
      headers: {
        TokenCybersoft: cybersoftKey.PM_key,
      },
    });
   
    dispatch(createAction(types.GET_CATEGORY, res.data.content));
  } catch (err) {
    console.log(err);
  }
};
export const fetchUserProject = (idProject) => {
  return async (dispatch) => {
    try {
      const res = await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Users/getUserByProjectId",
        method: "GET",
        params: { idProject },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.PM_key,
        },
      });
      
      dispatch(createAction(types.FETUSER_PROJECT, res.data.content));
    } catch (err) {
        const showErr = { ...err };
        console.log(showErr);
    }
  };
};

export const getDetailProject = (id) => {
    return async (dispatch) => {
        try{
            const res = await axios({
                url:"https://jiranew.cybersoft.edu.vn/api/Project/getProjectDetail",
                method:"GET",
                params:{
                    id,
                },
                headers:{
                    Authorization:"Bearer "+ localStorage.getItem("isLogin"),
                    TokenCybersoft: cybersoftKey.HH_key,
                }
               
            })
            dispatch(createAction(types.GET_DETAIL_PROJECT,res.data.content));
           
        }catch(err){
            console.log(err);
        }
    }
} 
