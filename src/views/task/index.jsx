import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Layout from "../../hocs/layout/layout";
import { Input, Select, Form, Button, Slider, InputNumber } from "antd";
import { useFormik } from "formik";
import "./task.css";
import { useDispatch } from "react-redux";
import { getAllProject } from "../../stores/action/project";
import { useSelector } from "react-redux";
import { getAssignees, getTaskType } from "../../stores/action/task";
import {getStatus} from '../../stores/action/status';
import { getAllPriority } from "../../stores/action/priority";
import axios from "axios";
import { cybersoftKey } from "../../stores/action/types";
import { successAlert, warningAlert } from "../../helpers/swal";
import * as yup from 'yup';
const { Option } = Select;

let schema = yup.object().shape({
  projectId: yup.string().matches(/[^0]/g,"Project invalid"),
  typeId: yup.string().matches(/[^0]/g,"Task type invalid"),
  taskName: yup.string().required('Invalid Task name'),
  statusId: yup.string().required('Invalid Status'),
  priorityId: yup.string().matches(/[^0]/g,'Invalid Priority'),
  originalEstimate: yup.string().matches(/[^0]/g,'Invalid Original Estimate'),
});


export default function Task() {
  const editorRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProject);
    dispatch(getStatus);
    dispatch(getTaskType);
    dispatch(getAllPriority(""));
  }, [dispatch]);

  const projects = useSelector((state) => state.project.projects);
  const status = useSelector((state) => state.status.status);
  const priorityList = useSelector((state) => state.priority.priorityList);
  const taskTypes = useSelector((state) => state.task.taskTypes);
  const assignees = useSelector((state) => state.task.assignees);

  const [disabled] = useState(false);

  const formik = useFormik({
    initialValues: {
      projectId: 0,
      taskName: "",
      statusId: "",
      priorityId: 0,
      typeId: 0,
      listUserAsign: [],
      timeTrackingSpent: 0,
      originalEstimate: 0,
      timeTrackingRemaining: 0,
      description: "",
    },
    validationSchema:schema,
    validateOnMount:true,
  });

  const onEditorChange = (content) => {
    formik.setFieldValue("description", content);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const setAllTouch = (action) => {
    for (const [key] of Object.entries(formik.initialValues)) {
       formik.setFieldTouched(key,action);
    }
    
  }
  const handleSubmit = async () => {
    setAllTouch(true);
    if (!formik.isValid) return;
  
    try {
      const res = await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/createTask",
        method: "POST",
        data: formik.values,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.HH_key,
        },
      });
      setTimeout(() =>{
        successAlert(res.data.message);
      },1200)
      
      setAllTouch(false);
      formik.setFieldValue("timeTrackingSpent",0);
      formik.resetForm({
          projectId: 0,
          taskName: "",
          statusId: "",
          priorityId: 0,
          typeId: 0,
          listUserAsign: [],
          timeTrackingSpent: 0,
          originalEstimate: 0,
          timeTrackingRemaining: 0,
          description: "",
      });

      
    } catch (err) {
      const showErr = { ...err };
      warningAlert(showErr.response.data.content);
     
    }
  };

  return (
    <Layout>
      <h2>Create Task</h2>
      <div className="task-content">
        <Form className="task-form" onFinish={handleSubmit}>
          <Form.Item className="w-100">
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="projectId"
              >
                Project
              </label>
              <Select
                name="projectId"
                id="projectId"
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                onChange={(value) => {
                  formik.setFieldValue("projectId", value);
                  formik.setFieldValue("listUserAsign", []);
                  dispatch(getAssignees(value));
                 
                }}
                onBlur={formik.handleBlur}
               
                value={formik.values.projectId ? formik.values.projectId : "" }
                onSearch={(value) => {
                  console.log(value);
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {projects.map(({ projectName, id }) => {
                  return (
                    <Option key={id} value={id}>
                      {projectName}
                    </Option>
                  );
                })}
              </Select>
            </div>
            {formik.touched.projectId && <p className="err">{formik.errors.projectId}</p>}
          </Form.Item>

          <Form.Item className="w-100">
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="taskName"
              >
                Task name
              </label>
              <Input
                name="taskName"
                id="taskName"
                value={formik.values.taskName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.taskName && <p className="err">{formik.errors.taskName}</p>}
          </Form.Item>

          <Form.Item className="w-100" hasFeedback>
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="status"
              >
                Status
              </label>
              <Select
                name="statusId"
                id="statusId"
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                onChange={(value) => {
                  formik.setFieldValue("statusId", value);
                }}
                value={formik.values.statusId ? formik.values.statusId : "" }
                onSearch={onSearch}
                onBlur={formik.handleBlur}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {status.map(({ statusId, statusName }) => {
                  return (
                    <Option key={statusId} value={statusId}>
                      {statusName}
                    </Option>
                  );
                })}
              </Select>
            </div>
            {formik.touched.statusId && <p className="err">{formik.errors.statusId}</p>}
          </Form.Item>

          <Form.Item className="w-49" hasFeedback>
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="priorityId"
              >
                Priority
              </label>
              <Select
                id="priorityId"
                name="priorityId"
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  formik.setFieldValue("priorityId", value);
                }}
                value={formik.values.priorityId ? formik.values.priorityId : "" }
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {priorityList.map(({ priorityId, priority }) => {
                  return (
                    <Option key={priorityId} value={priorityId}>
                      {priority}
                    </Option>
                  );
                })}
              </Select>
            </div>
            {formik.touched.priorityId && <p className="err">{formik.errors.priorityId}</p>}
          </Form.Item>

          <Form.Item className="w-49" hasFeedback>
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="typeId"
              >
                Task type
              </label>
              <Select
                id="typeId"
                name="typeId"
                value={formik.values.typeId ? formik.values.typeId : "" }
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  formik.setFieldValue("typeId", value);
                }}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {taskTypes.map(({ id, taskType }) => {
                  return (
                    <Option key={id} value={id}>
                      {taskType}
                    </Option>
                  );
                })}
              </Select>
            </div>
            {formik.touched.typeId && <p className="err">{formik.errors.typeId}</p>}
          </Form.Item>

          <Form.Item className="w-49" hasFeedback>
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="listUserAsign"
              >
                Assignees
              </label>
              <Select
                mode="tags"
                id="listUserAsign"
                name="listUserAsign"
                
                showSearch
                style={{ width: "100%" }}
                optionFilterProp="children"
                onChange={(value) => {
                  formik.setFieldValue("listUserAsign", value);
                }}
                value={formik.values.listUserAsign}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {assignees.map(({ userId, name }) => {
                  return (
                    <Option key={userId} value={userId}>
                      {name}
                    </Option>
                  );
                })}
              </Select>
            </div>
            
          </Form.Item>

          <Form.Item className="w-49" hasFeedback>
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="timeTracking"
              >
                Time tracking
              </label>
              <Slider
                min={0}
                max={formik.values.originalEstimate}
                name="timeTracking"
                onChange={(value) => {
                  formik.setFieldValue("timeTrackingSpent",value);
                  formik.setFieldValue("timeTrackingRemaining",formik.values.originalEstimate - value)
                }
                  
                }
                value={formik.values.timeTrackingSpent}
                disabled={disabled}
                defaultValue={formik.values.timeTrackingSpent}
              />
              <div className="time-traking">
                <b>{formik.values.timeTrackingSpent}h Logged</b>
                <b>{formik.values.timeTrackingRemaining}h remaining</b>
              </div>
            </div>
          </Form.Item>

          <Form.Item className="w-49" hasFeedback>
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="originalEstimate"
              >
                Original Estimate
              </label>
              <InputNumber
                style={{ width: "100%" }}
                name="originalEstimate"
                min={0}
                value={formik.values.originalEstimate}
                max={1000}
                defaultValue={0}
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  formik.setFieldValue("originalEstimate", value);
                  formik.setFieldValue("timeTrackingSpent", 0);
                  formik.setFieldValue("timeTrackingRemaining", value);
                }}
              />
            </div>
            {formik.touched.originalEstimate && <p className="err">{formik.errors.originalEstimate}</p>}
          </Form.Item>

          <Form.Item className="w-24" hasFeedback>
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="timeTrackingSpent"
              >
                Time spent
              </label>
              <InputNumber
                style={{ width: "100%" }}
                name="timeTrackingSpent"
                min={0}
                max={formik.values.originalEstimate}
                defaultValue={0}
                value={formik.values.timeTrackingSpent}
                onChange={(value) => {
                  formik.setFieldValue("timeTrackingSpent", value);

                  formik.setFieldValue(
                    "timeTrackingRemaining",
                    formik.values.originalEstimate - value
                  );
                }}
              />
            </div>
          </Form.Item>

          <Form.Item className="w-24" hasFeedback>
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="timeTrackingRemaining"
              >
                Time remaining
              </label>
              <InputNumber
                id="timeTrackingRemaining"
                style={{ width: "100%" }}
                name="timeTrackingRemaining"
                min={0}
                max={formik.values.originalEstimate}
                value={formik.values.timeTrackingRemaining}
                defaultValue={0}
                onChange={(value) => {
                  formik.setFieldValue("timeTrackingRemaining", value);
                  formik.setFieldValue(
                    "timeTrackingSpent",
                    formik.values.originalEstimate - value
                  );
                }}
              />
            </div>
          </Form.Item>

          <Form.Item className="w-100" hasFeedback>
            <div className="form-group">
              <label
                style={{ marginBottom: 5, display: "block" }}
                htmlFor="timeremaining"
              >
                Description
              </label>
              <Editor
                apiKey="a2dm5qu81i3x9zwq6k87g28uwoz2dwhi3nbaplumzqv9a8np"
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={formik.values.description}
                init={{
                  height: 300,
                  menubar: true,
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
            </div>
          </Form.Item>

          <Form.Item className="w-100">
            <div className="form-group">
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Add Task
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}
