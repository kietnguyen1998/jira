import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthPrivate, AuthRoute } from "./hocs/router/route";
import { checkIsMe } from "./stores/action/me";
import Board from "./views/board";
import CreateProject from "./views/createProject/createProject";
import DashBoard from "./views/dashboard";
import Project from "./views/project";
import Signin from "./views/signin";
import Signup from "./views/signup";
import Task from "./views/task";
import User from "./views/user";
import AccountInfo from "./views/user/AccountInfo";
import ChangePassword from "./views/user/ChangePassword";

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkIsMe);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Switch>
        <AuthRoute
          path="/"
          exact
          Component={Signin}
          Redirectpath="/dashboard/"
        ></AuthRoute>
        <AuthRoute path="/signup/" Component={Signup} Redirectpath="/dashboard/"></AuthRoute>
        <AuthPrivate
          path="/dashboard/"
          Component={DashBoard}
          Redirectpath="/"
        ></AuthPrivate>
        <AuthPrivate
          path="/project/"
          exact
          Component={Project}
          Redirectpath="/"
        ></AuthPrivate>
        <AuthPrivate
          path="/board/"
          Component={Board}
          Redirectpath="/"
        ></AuthPrivate>
        <AuthPrivate
          path="/task/"
          Component={Task}
          Redirectpath="/"
        ></AuthPrivate>
        <AuthPrivate
          path="/user/"
          exact
          Component={User}
          Redirectpath="/"
        ></AuthPrivate>
        <AuthPrivate
          path="/project/create-project"
          exact
          Component={CreateProject}
          Redirectpath="/"
        ></AuthPrivate>
        <AuthPrivate
          path="/user/acount"
          exact
          Component={AccountInfo}
          Redirectpath="/"
        ></AuthPrivate>
        <AuthPrivate
          path="/user/changepassword"
          exact
          Component={ChangePassword}
          Redirectpath="/"
        ></AuthPrivate>
      </Switch>
    </BrowserRouter>
  );
}
