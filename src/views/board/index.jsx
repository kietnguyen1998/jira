import React, { useEffect, useState } from "react";
import Layout from "../../hocs/layout/layout";
import { DragDropContext } from "react-beautiful-dnd";
import ColumnDropAndDrag from "../../components/column/";
import { useSelector, useDispatch } from "react-redux";
import { Col, Row } from "antd";
import { getAllProject, getDetailProject } from "../../stores/action/project";
import axios from "axios";
import { cybersoftKey } from "../../stores/action/types";
import { Select } from "antd";
import "./board.css";
const { Option } = Select;

export default function Board() {
  const dispatch = useDispatch();
  const lstTask = useSelector((state) => {
    if (state.project.projectsDetail) {
      return state.project.projectsDetail.lstTask;
    }
  });
  const lstInfo = useSelector((state) => {
    if (state.project.projectsDetail) {
      return state.project.projectsDetail;
    }
  });
  const [cloneLstTask, setCloneLstTask] = useState([]);
  const [idProject, setIdProject] = useState(0);

  useEffect(() => {
    dispatch(getAllProject);
  }, [dispatch]);

  useEffect(() => {
    setCloneLstTask(lstTask);
  }, [lstTask]);

  useEffect(() => {
    setIdProject(idProject);
  }, [idProject]);

  const getProjects = useSelector((state) => state.project.projects);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let finish = destination.droppableId;
    let begin = source.droppableId;
    let lstTaskCloneProcess = [...cloneLstTask];
    const indexEnd = lstTaskCloneProcess.findIndex(
      (item) => item.statusId === finish
    );
    const indexStart = lstTaskCloneProcess.findIndex(
      (item) => item.statusId === begin
    );
   

    if (finish === begin) {
        
        
        let removeItem = lstTaskCloneProcess[indexEnd].lstTaskDeTail.splice(source.index,1);
        lstTaskCloneProcess[indexEnd].lstTaskDeTail.splice(destination.index,0,removeItem[0]);
    } else {
      try {
        
        
        const indexItem = lstTaskCloneProcess[
          indexStart
        ].lstTaskDeTail.findIndex((item) => item.taskId === +draggableId);

        const newItem = lstTaskCloneProcess[indexStart].lstTaskDeTail[indexItem];
        lstTaskCloneProcess[indexStart].lstTaskDeTail.splice(indexItem, 1);
        lstTaskCloneProcess[indexEnd].lstTaskDeTail.splice(destination.index,0,newItem);

        setCloneLstTask(lstTaskCloneProcess);

        // console.log(newItem);
        // console.log(destination);
        // console.log(source);
        // console.log(draggableId);
        // console.log(lstTaskCloneProcess);
        await axios({
          url: "https://jiranew.cybersoft.edu.vn/api/Project/updateStatus",
          method: "PUT",
          data: {
            taskId: draggableId,
            statusId: finish,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("isLogin"),
            TokenCybersoft: cybersoftKey.HH_key,
          },
        });
        // dispatch(getDetailProject(idProject));
      } catch (err) {
        console.log(err);
      }
    }
  };
  const onChange = (value) => {
    setIdProject(value);
    dispatch(getDetailProject(value));
  };

  return (
    <Layout>
      <div className="board-container">
        <h2>Board</h2>
        <Select
          showSearch
          style={{ width: 250, margin: "0px 0 30px", marginRight: 20 }}
          placeholder="Select project"
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {getProjects &&
            getProjects.map(({ id, projectName }) => (
              <Option value={id} key={id}>
                {projectName}
              </Option>
            ))}
        </Select>
        <div className="group-assign" style={{ display: "inline-block" }}>
          {lstInfo &&
            lstInfo.members.map(({ avatar, userId, name }) => (
              <img key={userId} src={avatar} alt={name} />
            ))}
        </div>

        <div
          className="info-board"
          style={{
            marginBottom: 10,
            textTransform: "capitalize",
            fontSize: 20,
            fontWeight: "600",
          }}
        >
          {lstInfo && (
            <div>
              <div>{lstInfo.projectName}</div>
            </div>
          )}
        </div>

        <Row gutter={16}>
          {cloneLstTask ? (
            <DragDropContext onDragEnd={onDragEnd}>
              {cloneLstTask &&
                cloneLstTask.map((item) => (
                  <ColumnDropAndDrag
                    key={item.statusId}
                    column={item}
                  ></ColumnDropAndDrag>
                ))}
            </DragDropContext>
          ) : (
            <Col className="no-project" style={{ color: "red", fontSize: 16 }}>
              <span>No projects selected.</span>
              <p>Please, choose a project !</p>
            </Col>
          )}
        </Row>
      </div>
    </Layout>
  );
}
