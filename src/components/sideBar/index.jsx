import React, {  useState,memo } from "react";
import { Menu } from "antd";
import {
  TableOutlined,
  ProjectOutlined,
  CalendarOutlined,
  UserOutlined,
  LeftCircleFilled,
  AppstoreAddOutlined
} from "@ant-design/icons";
import "./sidebar.css";
import logo from "../../assets/img/logoProject.svg";
import { NavLink,useHistory } from "react-router-dom";

function SideBar(props) {
  const history = useHistory();
  
  const [selectedSidebar] = useState(() => {
      const path = history.location.pathname;
      return path;
  });
 
  return (
    <div>
         <div className="resize" onClick={props.onHandleResize}>
            <LeftCircleFilled />
        </div>
      <div className="sidebar-info">
       
        <img className="sidebar-img" src={logo} alt="sidebar-logo" />
        <div className="siderbar-content">
          <h3 style={{ margin: 0, lineHeight: "1.3em" }}>jira.com.vn</h3>
          <p>Software project</p>
        </div>
      </div>
      <div className="sidebar-menu">
        <Menu style={{ width: "100%" }} selectedKeys={selectedSidebar}>
          <Menu.Item key="/board" icon={<TableOutlined />}>
            <NavLink to="/board">Board</NavLink>
          </Menu.Item>

          <Menu.Item key="/project/create-project" icon={<AppstoreAddOutlined />}>
            <NavLink to="/project/create-project">Create Project</NavLink>
          </Menu.Item>
          
          <Menu.Item key="/project" icon={<ProjectOutlined />}>
            <NavLink to="/project">Project Management</NavLink>
          </Menu.Item>

         

          <Menu.Item key="/task" icon={<CalendarOutlined />}>
            <NavLink to="/task">Task Management</NavLink>
          </Menu.Item>

          <Menu.Item key="/user" icon={<UserOutlined />}>
            <NavLink to="/user">Account Management</NavLink>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
}
export default memo(SideBar)