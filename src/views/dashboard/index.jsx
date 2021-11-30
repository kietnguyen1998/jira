import {
  ArrowRightOutlined,
  BarChartOutlined,
  FundProjectionScreenOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Layout from "../../hocs/layout/layout";
import { getAllProject } from "../../stores/action/project";
import { fetchUser } from "../../stores/action/user";
import "./dashboard.css";
export default function DashBoard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProject);
    dispatch(fetchUser(""));
  },[dispatch])
  const projects = useSelector(state =>  state.project.projects);
  const users = useSelector(state =>  state.users.users);

  return (
    <Layout>
      <h2>Dashboard</h2>
      <Row gutter={24}>
        <Col span={8}>
          <div className="dashboard">
            <div className="dashboard__content">
              <div className="dashboard__item">
                <h1>{projects && projects.length}</h1>
                <span>Project</span>
              </div>
              <div className="dashboard__icon">
                <FundProjectionScreenOutlined />
              </div>
            </div>
            <div className="dashboard__viewmore">
              <NavLink to="/project">
                More Info&nbsp;
                <ArrowRightOutlined />
              </NavLink>
            </div>
          </div>
        </Col>
       
        <Col span={8}>
          <div className="dashboard">
            <div className="dashboard__content" style={{background:"#ffc108"}}>
              <div className="dashboard__item">
                <h1>{users && users.length}</h1>
                <span>User</span>
              </div>
              <div className="dashboard__icon" style={{color:"#d9a406"}}>
                <UsergroupDeleteOutlined />
              </div>
            </div>
            <div className="dashboard__viewmore" style={{background:"#e5ad05"}}>
              <NavLink to="/user">
                More Info&nbsp;
                <ArrowRightOutlined />
              </NavLink>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div className="dashboard">
            <div className="dashboard__content" style={{background:"#28a745"}}>
              <div className="dashboard__item">
                <h1>Bulk</h1>
                <span>Task</span>
              </div>
              <div className="dashboard__icon" style={{color:"#228e3b"}}>
                <BarChartOutlined />
              </div>
            </div>
            <div className="dashboard__viewmore" style={{background:"#23963e"}}>
              <NavLink to="/task">
                More Info&nbsp;
                <ArrowRightOutlined />
              </NavLink>
            </div>
          </div>
        </Col>
      </Row>
    </Layout>
  );
}
