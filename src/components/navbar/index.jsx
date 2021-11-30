import React, { useCallback,memo } from "react";
import { Layout, Menu, Dropdown, Button} from "antd";
import logo from "../../assets/img/logo.svg";
import {
  CaretDownOutlined,
  LogoutOutlined,
  SettingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {useHistory} from 'react-router-dom'
import { logOut } from "../../stores/action/me";

const { Header } = Layout;



function Navbar() {
  const me = useSelector((state) => state.me);
  const history = useHistory();
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logOut(() => {history.push("/")}))
  },[dispatch,history])

  return (
    <Header>
      <div className="logo-pages">
        <NavLink to="/dashboard">
          <img src={logo} alt="logo" />
        </NavLink>
       
      </div>
      {me && (
        <Dropdown overlay={
          <Menu>
          <Menu.Item key="/user/acount">
            <NavLink to="/user/acount">
              <SettingOutlined /> Account information
            </NavLink>
          </Menu.Item>
      
          <Menu.Item key="/user/changepassword">
            <NavLink to="/user/changepassword">
              <EditOutlined /> Change password
            </NavLink>
          </Menu.Item>
      
          <Menu.Item key="logout">
            <div onClick={logout}>
              <LogoutOutlined /> Logout
            </div>
          </Menu.Item>
        </Menu>
        } placement="topRight" arrow>
          <Button>
            Hello, <b> {me.name}</b> <CaretDownOutlined />
          </Button>
        </Dropdown>
      )}
    </Header>
  );
}
export default memo(Navbar)