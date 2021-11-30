import React from "react";
import { Redirect, Route } from "react-router-dom";

export default function CreateRouter(condition) {
  return (props) => {
    const { path, Component, exact, Redirectpath } = props;
    return (
      <Route
        path={path}
        exact={exact}
        render={(item) => {
          if (condition()) {
            return <Component {...item} />;
          }
          return <Redirect to={Redirectpath} />;
        }}
      ></Route>
    );
  };
};
export const AuthRoute = CreateRouter(()=> !localStorage.getItem("isLogin"));
export const AuthPrivate = CreateRouter(()=> localStorage.getItem("isLogin"));