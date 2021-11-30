import React, { useCallback, useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Modal, Input, Select, Slider, Button, InputNumber, Avatar } from "antd";
import "./task.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getComment } from "../../stores/action/comments";
import axios from "axios";
import { cybersoftKey } from "../../stores/action/types";
import { getTaskDetail, getTaskType } from "../../stores/action/task";
import { getStatus } from "../../stores/action/status";
import { errorAlert, questionAlert, successAlert, warningAlert } from "../../helpers/swal";
import { getDetailProject } from "../../stores/action/project";
import { Editor } from "@tinymce/tinymce-react";
import { getAllPriority } from "../../stores/action/priority";
const { Option } = Select;

export default function TaskDragDrop(props) {
  const editorRef = useRef(null);
  const { TextArea } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInitialValue, setIsInitiaVlue] = useState("");
  const [desctipionTask, setDesctipionTask] = useState(props.task.description);
  const [items, setItems] = useState([]);
  const getAssignDefault = () => {
    let cloneData = [];
    if(props.task.assigness){
        for(let item of props.task.assigness){
           cloneData.push(item.id);
        }
    }
    return cloneData;
  };
  const [assignDefault] = useState(getAssignDefault);
  const [original, setOriginal] = useState(props.task.originalEstimate);
  const [timespent, setTimespent] = useState(props.task.timeTrackingSpent);
  const [timeremain, setTimeremain] = useState(props.task.timeTrackingRemaining);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const idProject = useSelector((state) => {
    return state.project.projectsDetail.id;
  });
  useEffect(() => {
     
  },[]);
  const dispatch = useDispatch();
  const onEditorChange = (content) => {
    setDesctipionTask(content);
  }
  const updateOriginalEstimate = async () => {
    try{
      await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/updateEstimate",
        method: "put",
        data: {
          taskId:props.task.taskId,
          originalEstimate:original
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.HH_key,
        },
      });
      successAlert("Update successful");
    }catch(err){
      errorAlert("Insufficient authority");
    }
  }
  const updateTimeTracking = async () => {
    try{
      await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/updateTimeTracking",
        method: "put",
        data: {
          taskId:props.task.taskId,
          timeTrackingSpent:timespent,
          timeTrackingRemaining:timeremain,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.HH_key,
        },
      });

    }catch(err){
      console.log(err);
    }
  }
  const updateTime = () => {
    updateOriginalEstimate();
    updateTimeTracking();
  }
  const assignUserFormTask = async (taskId,userId,idProject) => {
    
    try{
      await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/assignUserTask",
        method: "post",
        data: {
          userId,
          taskId
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.HH_key,
        },
      });
      dispatch(getDetailProject(idProject));
      successAlert("Update successful");
    }catch(err){
      errorAlert("Insufficient authority");
    }

  }
  const removeUserFormTask = async (taskId,userId,idProject) => {
    try{
      await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/removeUserFromTask",
        method: "post",
        data: {
          userId,
          taskId
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.HH_key,
        },
      });
      dispatch(getDetailProject(idProject));
      successAlert("Update successful");
    }catch(err){
      errorAlert("Insufficient authority");
    }
  }

  const showModal = (taskId) => {
    setIsModalVisible(true);
    dispatch(getComment(taskId));
    dispatch(getTaskDetail(taskId));
    dispatch(getStatus);
    console.log(props);
  };

  useEffect(() => {
    dispatch(getTaskType);
    dispatch(getAllPriority(""));
  }, [dispatch]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getAllComment = useSelector((state) => state.comment.comments);
  const getTaskDetails = useSelector((state) => state.task.taskDetail);
  const getAllStatus = useSelector((state) => state.status.status);
  const getTasktype = useSelector((state) => state.task.taskTypes);
  const priorityList = useSelector((state) => state.priority.priorityList);
  const listMember = useSelector(state => {
    if(state.project.projectsDetail){
       return state.project.projectsDetail.members;
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getStatusDetail = () => {
    if (getTaskDetails && getTaskDetails.statusId && getAllStatus) {
      let index = getAllStatus.findIndex((item) => {
        return item.statusId === getTaskDetails.statusId;
      });
      if (index === -1) {
        return "";
      } else {
        return getAllStatus[index].statusName;
      }
    } else {
      return "";
    }
  };

  useEffect(() => {
    getStatusDetail();
  }, [getStatusDetail]);

  const itemsRef = useRef([]);

  const handleRef = (key) => {
    const cloneItem = [...items];
    for(let item of cloneItem){
      item.active = false;
    }
    cloneItem[key].active = true;
    setItems(cloneItem);
  };

  useEffect(() => {
    if (getAllComment) {
      const data = [];
      for (let i = 0; i < getAllComment.length; i++) {
        data.push({ active: false });
      }
      setItems((old) => [...data]);
    }
  }, [getAllComment]);

  const getMe = useSelector((state) => state.me);

  const onChange = (e) => {
    setIsInitiaVlue(e.target.value);
  };

  const handleSendComment = useCallback(
    async (taskId) => {
      if(!isInitialValue){
        warningAlert("Comment cannot be empty");
        return;
      }
      const data = {
        taskId: taskId,
        contentComment: isInitialValue,
      };
      try {
        const res = await axios({
          url: "https://jiranew.cybersoft.edu.vn/api/Comment/insertComment",
          method: "POST",
          data: data,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("isLogin"),
            TokenCybersoft: cybersoftKey.HH_key,
          },
        });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
      dispatch(getComment(taskId));
      setIsInitiaVlue("");
    },
    [dispatch, isInitialValue]
  );

  const handleDeleteComment = useCallback(
    async (e, item) => {
      e.preventDefault();
      try {
        const res = await axios({
          url: "https://jiranew.cybersoft.edu.vn/api/Comment/deleteComment",
          method: "DELETE",
          params: { idComment: item.id },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("isLogin"),
            TokenCybersoft: cybersoftKey.HH_key,
          },
        });
        console.log(res);
      } catch (err) {
        const showErr = { ...err };
        console.log(showErr);
      }
      dispatch(getComment(item.taskId));
    },
    [dispatch]
  );

  const handleEditComment = useCallback(
    async (e, item, key) => {
      e.preventDefault();
      
      try {
        const res = await axios({
          url: "https://jiranew.cybersoft.edu.vn/api/Comment/updateComment",
          method: "PUT",
          params: {
            id: item.id,
            contentComment: e.target[0].value,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("isLogin"),
            TokenCybersoft: cybersoftKey.HH_key,
          },
        });
        console.log(res);
      } catch (err) {
        const ShowErr = { ...err };
        console.log(ShowErr);
      }
      const cloneItem2 = [...items];
      cloneItem2[key].active = false;
      setItems(cloneItem2);
      dispatch(getComment(item.taskId));
    },
    [dispatch, items]
  );

  const removeTask = (taskId, idProject) => {
    return async () => {
      try {
        await axios({
          url: "https://jiranew.cybersoft.edu.vn/api/Project/removeTask",
          method: "delete",
          params: {
            taskId,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("isLogin"),
            TokenCybersoft: cybersoftKey.HH_key,
          },
        });
        dispatch(getDetailProject(idProject));
        // successAlert(res.data.message);
        successAlert("Delete successfully");
      } catch (err) {
        //const showErr = { ...err };
        //errorAlert(showErr.response.data.message);
        errorAlert("Insufficient access");
      }
    };
  };
  
  const handleRemoveTask = (taskId) => {
    questionAlert("Are you sure delete task?", removeTask(taskId, idProject));
  };
  const updateDescription = async(taskId) => {
    try{
      await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/updateDescription",
        method: "put",
        data: {
          taskId,
          description:desctipionTask,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.HH_key,
        },
      });
      successAlert("Update successful");
    }catch(err){
      const showErr = {...err};
      errorAlert(showErr.response.data.content);
    }
  }
  const updatePriority = async (priorityId,taskId) => {
     try{
      await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/updatePriority",
        method: "put",
        data: {
          taskId,
          priorityId,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.HH_key,
        },
      });
      successAlert("Update successful");
    }catch(err){
      const showErr = {...err};
      errorAlert(showErr.response.data.content);
    }
  }

  return (
    <Draggable draggableId={props.task.taskId.toString()} index={props.index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="task-container"
            style={{
              margin: "10px 0",
              padding: 8,
              borderRadius: 2,
              boxShadow: "#ccc 0 0 2px",
              ...provided.draggableProps.style,
              background: snapshot.isDragging ? "#fcfcfc" : "white",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: "600",
                textTransform: "capitalize",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span>{props.task.taskName}</span>
            </div>
            <div className="task-detail">
              <div
                style={{
                  color: "#fff",
                  fontSize: 14,
                  background:
                    props.task.taskTypeDetail.id === 1 ? "red" : "#0eb90e",
                  padding: "3px 15px",
                  textTransform: "capitalize",
                  borderRadius: 2,
                  cursor: "pointer",
                }}
              >
                {props.task.taskTypeDetail.taskType}
              </div>
              {/* <div className="task-assign">
                {props.task.assigness &&
                  props.task.assigness.map(({ id, avatar, name }) => {
                    return (
                      
                      <div className="task-img" key={id}>
                        <img src={avatar} alt={name} />
                      </div>
                    );
                  })}
              </div> */}
               <Avatar.Group
                    maxCount={2}
                    maxPopoverPlacement="none"
                    maxStyle={{
                      color: "#f56a00",
                      backgroundColor: "#fde3cf",
                    }}
                  >
                {props.task.assigness &&
                  props.task.assigness.map(({ id, avatar, name }) => {
                    return (
                      
                      
                        <Avatar style={{background:"#ddd"}} src={avatar} alt={name}  size={32} key={id}/>
                      
                    );
                  })}
              </Avatar.Group>
            </div>
            <div
              style={{
                margin: "15px 0 0",
                justifyContent: "flex-end",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className="taskhandle"
                onClick={() => showModal(props.task.taskId)}
              >
                <EditOutlined />
              </div>
              <div
                className="taskhandle"
                onClick={() => handleRemoveTask(props.task.taskId)}
              >
                <DeleteOutlined />
              </div>
            </div>

            <Modal
              title=""
              visible={isModalVisible}
              onCancel={handleCancel}
              footer=""
              width="900px"
            >
              <div className="header-taskdetail">
                <Select
                  showSearch
                  style={{ width: 120, marginBottom: 10 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={(value) => {
                    console.log(value);
                  }}
                  defaultValue={props.task.taskTypeDetail.id}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {getTasktype &&
                    getTasktype.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.taskType}
                      </Option>
                    ))}
                </Select>
              </div>
              <div className="taskdetail-container">
                <div className="taskdetail-left">
                  <h2>
                    This is an issue of type:{" "}
                    {props.task.taskTypeDetail.taskType}
                  </h2>
                  <div>
                    <p>Desctiption: </p>
                    <Editor
                      apiKey="a2dm5qu81i3x9zwq6k87g28uwoz2dwhi3nbaplumzqv9a8np"
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      
                      value={desctipionTask}
                      init={{
                        height: 150,
                        menubar: false,
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],
                        toolbar:
                          "undo redo | formatselect | " +
                          "bold italic backcolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | help",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                      onEditorChange={onEditorChange}
                     
                    />
                    <Button onClick={() => updateDescription(props.task.taskId)} type="primary" style={{marginTop:5}}>Update description</Button>
                  </div>

                 
                  <br/>
                  <div className="comment">
                    <h3>Comment</h3>
                    <div
                      className="group__comment"
                      style={{ display: "flex", margin: "10px 0 15px" }}
                    >
                      <img
                        style={{
                          width: 70,
                          height: 55,
                          objectFit: "cover",
                          boxShadow: "#ccc 0 0 2px",
                        }}
                        src={getMe && getMe.avatar}
                        alt={getMe && getMe.name}
                      />
                      <div
                        style={{
                          width: "calc(100% - 80px)",
                          marginLeft: 10,
                          textAlign: "right",
                        }}
                      >
                        <TextArea
                          style={{
                            padding: 5,
                            border: "1px solid #ccc",
                            width: "100%",
                          }}
                          placeholder="Add a comment ..."
                          autoSize={{ minRows: 2, maxRows: 5 }}
                          allowClear
                          onChange={onChange}
                          value={isInitialValue}
                        ></TextArea>

                        <Button
                          style={{ margin: "10px 0" }}
                          type="primary"
                          onClick={() => {
                            handleSendComment(props.task.taskId);
                          }}
                        >
                          Send
                        </Button>
                      </div>
                    </div>

                    <div className="list-comment" style={{ marginTop: 15 }}>
                      {getAllComment &&
                        getAllComment.map((item, i) => {
                          return (
                            <div
                              key={item.id}
                              className="item--comnent"
                              style={{ display: "flex", margin: "10px 0 15px" }}
                              ref={(el) => (itemsRef.current[i] = el)}
                            >
                              <img
                                style={{
                                  width: 70,
                                  height: 55,
                                  objectFit: "cover",
                                  boxShadow: "#ccc 0 0 2px",
                                }}
                                src={item.user.avatar}
                                alt={item.name}
                              />
                              {getMe && getMe.id === item.user.userId ? (
                                <div
                                  style={{
                                    width: "calc(100% - 80px)",
                                    marginLeft: 10,
                                    textAlign: "left",
                                  }}
                                >
                                  {items[i] && items[i]["active"] ? (
                                    <form
                                      onSubmit={(e) =>
                                        handleEditComment(e, item, i)
                                      }
                                    >
                                      <textarea
                                        style={{
                                          padding: 5,
                                          border: "1px solid #ccc",
                                          width: "100%",
                                        }}
                                        autoSize={{ minRows: 2, maxRows: 5 }}
                                      >
                                        {item.contentComment}
                                      </textarea>
                                      <button className="commentButton" id="submit" type="submit">
                                        Done
                                      </button>
                                    </form>
                                  ) : (
                                    <>
                                    <div
                                      style={{
                                        backgroundColor: "rgb(243 238 238)",
                                        border: "1px soloid #ccc ",
                                        height: 55,
                                      }}
                                    >
                                      <p
                                        style={{
                                          marginLeft: "10px",
                                        }}
                                      >
                                        {item.contentComment}
                                      </p>
                                    </div>

                                    <button
                                      style={{
                                        marginTop: "7px ",
                                      }}
                                      className="commentButton"
                                      htmlType="submit"
                                      onClick={() => {
                                        handleRef(i);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="dButton"
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      htmlType="submit"
                                      onClick={(e) => {
                                        handleDeleteComment(e, item);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </>
                                  )}
                                </div>
                              ) : (
                                <div
                                  style={{
                                    width: "calc(100% - 80px)",
                                    marginLeft: 10,
                                    textAlign: "left",
                                  }}
                                >
                                  <TextArea
                                    autoSize={{ minRows: 2, maxRows: 5 }}
                                    disabled={true}
                                    value={item.contentComment}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="taskdetail-right">
                  <div className="grouptaskdetail">
                    <label htmlFor="">STATUS</label>
                    <Input
                      placeholder="Basic usage"
                      disabled={true}
                      value={getStatusDetail()}
                    />
                  </div>

                  <div className="grouptaskdetail">
                    <label htmlFor="">ASSIGNEES</label>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      defaultValue={assignDefault}
                      // onChange={(value) => {
                      //   console.log(value);
                      // }}
                      onDeselect={value => removeUserFormTask(props.task.taskId,value,idProject)}
                      onSelect={value => assignUserFormTask(props.task.taskId,value,idProject)}
                     
                    >
                      {listMember &&
                       
                       listMember.map((item) => (
                          <option value={item.userId} key={item.userId}>
                            {item.name}
                          </option>
                        ))}
                    </Select>
                  </div>

                  <div className="grouptaskdetail">
                    <label htmlFor="">PRIORITY</label>
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Select a person"
                      optionFilterProp="children"
                      onChange={(value) => updatePriority(value,props.task.taskId)}
                      defaultValue={props.task.priorityTask.priority}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      
                      {priorityList && priorityList.map(item => <Option value={item.priorityId} key={item.priorityId}>{item.priority}</Option>)}
                     
                    </Select>
                  </div>

                  <div className="grouptaskdetail">
                    <label htmlFor="">ORIGINAL EXTIMATE(HOURS)</label>
                    <InputNumber style={{width:"100%"}} size="medium" min={timespent} max={100000} defaultValue={original} onChange={(value) => {
                      setOriginal(value);
                      setTimeremain(value - timespent);
                     
                    }} />
                  </div>
                  <div className="grouptaskdetail">
                    <label htmlFor="">TIME TRACKING</label>
                    <Slider onChange={(value) => {
                        console.log(value);
                        setTimespent(value);
                        setTimeremain(original - value);
                    }} defaultValue={timespent} max={original} />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{timespent}h logged</span>
                      <span>{timeremain}h remaning</span>
                      
                    </div>

                    <Button onClick={updateTime} style={{width:"100%",marginTop:20}} type="primary">Update time</Button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        );
      }}
    </Draggable>
  );
}
