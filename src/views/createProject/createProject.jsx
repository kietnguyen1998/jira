import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../hocs/layout/layout";
import { Input, Button, Form, Select } from "antd";
import { getCategory } from "../../stores/action/project";
import { useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { errorAlert, successAlert } from "../../helpers/swal";
import { cybersoftKey } from "../../stores/action/types";
export default function CreateProject() {
  const dispatch = useDispatch();

  const getCategoryFc = useCallback(() => {
    dispatch(getCategory);
  }, [dispatch]);

  const typeProject = useSelector((state) => {
    return state.project.categorys;
  });
  useEffect(() => {
    getCategoryFc();
  }, [dispatch, getCategoryFc]);

  const { Option } = Select;

  const [form] = Form.useForm();

  const onEditorChange = (description) => {
    form.setFieldsValue({
      description,
    });
  };

  const onFinish = async (values) => {
    
    let description = values.description ? values.description : "";
    const data = {
      projectName: values.name,
      description,
      categoryId: values.categoryId,
    };

    try {
      await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/createProjectAuthorize",
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.PM_key,
        },
        data: data,
      });
      
      successAlert("Create Project in successfully");
    } catch (err) {
      const showErr = { ...err };
      errorAlert(showErr.response.data.message);
      console.log(showErr);
    }

    form.resetFields();
  };
  const onReset = () => {
    form.resetFields();
  };

  const editorRef = useRef(null);
  return (
    <Layout>
      <h2>Create Project</h2>
      <Form
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Type Project"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            {typeProject.map((item) => {
              return (
                <Option value={item.id}>{item.projectCategoryName}</Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 5, display: "block" }}
          label="Description"
          name="description"
        >
          <>
            <Editor
              apiKey="a2dm5qu81i3x9zwq6k87g28uwoz2dwhi3nbaplumzqv9a8np"
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={form.getFieldValue("description")}
              init={{
                height: 300,
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
          </>
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" style={{ margin: "0 20px" }}>
            Create Project
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
}
