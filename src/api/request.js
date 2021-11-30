import axios from "axios";


export const request = ({ url, data, params, method }) => {
  const variables = {
    url,
    data,
    params,
    method,
  };
  const token = localStorage.getItem("t");
  if (token) {
    variables.headers = {
      Authorization: "Bearer " + token,
    };
  }
  return axios(variables);
};
