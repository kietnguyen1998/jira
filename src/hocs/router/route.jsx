import React from "react";
import { Redirect, Route } from "react-router";

export default function CreateRouter(condition) {
  return (props) => {
    const { path, Component, exact, Redirectpath } = props;
    return (
      <Route
        path={path}
        exact={exact}
        render={() => {
          if (condition()) {
            return <Component />;
          }
          return <Redirect to={Redirectpath} />;
        }}
      ></Route>
    );
  };
}

export const AuthRoute = CreateRouter(() => !localStorage.getItem("isLogin"));
export const AuthPrivate = CreateRouter(() => localStorage.getItem("isLogin"));
