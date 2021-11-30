import React, { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../../hocs/layout/layout";
import {
  Table,
  Tag,
  Space,
  Input,
  Popconfirm,
  Button,
  Modal,
  Form,
  Select,
  Divider,
  Popover,
  Avatar,
} from "antd";

import { useDispatch } from "react-redux";
import {
  deleteProject,
  fetchProject,
  getCategory,
  fetchUserProject,
} from "../../stores/action/project";
import { useSelector } from "react-redux";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  FormOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { fetchUserSearch } from "../../stores/action/user";
import { cybersoftKey } from "../../stores/action/types";
import axios from "axios";
import { errorAlert, successAlert } from "../../helpers/swal";

export default function Project() {
  const [projectId, setProjectId] = useState(0);
  const [rowUserPro, setRowUserPro] = useState(0);
  const [addUser, setAddUser] = useState(0);

  const dispatch = useDispatch();
  const { Search } = Input;
  const customPagination = () => {
    return {
      total: data.length,
      defaultPageSize: 7,
      showSizeChanger: false,
    };
  };

  const fetProject = useCallback(() => {
    dispatch(fetchProject(null));
  }, [dispatch]);
  const onSearch = useCallback(
    (value) => {
      dispatch(fetchProject(value));
    },
    [dispatch]
  );

  const data = useSelector((state) => {
    return state.project.projects;
  });
  const getCategoryFc = useCallback(() => {
    dispatch(getCategory);
  }, [dispatch]);

  const typeProject = useSelector((state) => {
    return state.project.categorys;
  });
  useEffect(() => {
    fetProject();
    getCategoryFc();
  }, [dispatch, projectId, rowUserPro, addUser, fetProject, getCategoryFc]);

  // DELETE PROJECT
  const handelDeletePro = useCallback(
    (id) => {
      dispatch(deleteProject(id));
      fetProject();
    },
    [dispatch, fetProject]
  );
  // END DELETE PROJECTC

  // EDIT PROJECT
  const [visible, setVisible] = useState(false);
  const { Option } = Select;

  const [form] = Form.useForm();
  const handleEditProject = useCallback(
    (value) => {
      form.setFieldsValue({
        id: value.id,
        projectName: value.projectName,
        categoryId: value.categoryId,
        description: value.description,
      });
    },
    [form]
  );

  const onEditorChange = (description) => {
    form.setFieldsValue({
      description,
    });
  };

  const onFinish = useCallback(
    async (values) => {
      let description = values.description ? values.description : "";
      const data = {
        projectName: values.projectName,
        description,
        categoryId: values.categoryId,
      };

      try {
        await axios({
          url: "https://jiranew.cybersoft.edu.vn/api/Project/updateProject",
          method: "PUT",
          params: {
            projectId: values.id,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("isLogin"),
            TokenCybersoft: cybersoftKey.PM_key,
          },
          data: data,
        });
       
        successAlert("Update Project in successfully");
      } catch (err) {
        const showErr = { ...err };
        console.log(showErr);
        errorAlert(showErr.response.data.message);
      }
      fetProject();
      form.resetFields();
      setTimeout(() => {
        setVisible(false);
      }, 1500);
    },
    [fetProject, form]
  );

  const editorRef = useRef(null);
  // END EDIT PROJECT

  // MEMBERS PROJECT

  const fetchUserPro = useCallback(
    (idProject) => {
      dispatch(fetchUserProject(idProject));
    },
    [dispatch]
  );

  const showModal = (idProject) => {
    dispatch(fetchUserProject(idProject));

    setProjectId(idProject);
  };
  const userProject = useSelector((state) => {
    return state.project.userProjects;
  });

  const handelRemoveUser = useCallback(
    async (value) => {
      const data = {
        userId: value,
        projectId: projectId,
      };

      try {
        await axios({
          url: "https://jiranew.cybersoft.edu.vn/api/Project/removeUserFromProject",
          method: "POST",
          data,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("isLogin"),
            TokenCybersoft: cybersoftKey.PM_key,
          },
        });
       
        fetchUserPro(projectId);
        fetProject();

        successAlert("Remove in successfully");
      } catch (err) {
        const showErr = { ...err };
        console.log(showErr);
        errorAlert(showErr.response.data.message);
      }
    },
    [fetProject, fetchUserPro, projectId]
  );
  // END MEMBER PROJECT

  // ADD MEMBER PROJECT
  const [selectionType] = useState("radio");
  const [isVisible, setIsVisible] = useState(false);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowUserPro(selectedRows);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
    },
  };

  const handelAddUserPro = useCallback(async () => {
    const data = {
      userId: rowUserPro[0].userId,
      projectId: addUser,
    };

    try {
    await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Project/assignUserProject",
        method: "POST",
        data: data,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("isLogin"),
          TokenCybersoft: cybersoftKey.PM_key,
        },
      });
     

      successAlert("Add user in successfully");
    } catch (err) {
      const showErr = { ...err };
      console.log(showErr);
      errorAlert(showErr.response.data.message);
    }

    fetProject();
  }, [rowUserPro, addUser, fetProject]);

  const onSearchUserPro = useCallback(
    (value) => {
      dispatch(fetchUserSearch(value));
    },
    [dispatch]
  );

  let dataUserAdd = useSelector((state) => {
    return state.users.userSearch;
  });
  const [cloneDataUserAdd,setCloneDataUserAdd] = useState("");
  useEffect(() => {
    const data =
      dataUserAdd &&
      dataUserAdd.map((item, index) => {
        return (item = { ...item, key: index + 1 });
      });
    setCloneDataUserAdd(data);
  }, [dataUserAdd]);

  // END ADD MEMBERS PROJECT
  return (
    <Layout>
      <h2>Project Management</h2>

      <Search
        placeholder="input search text"
        onSearch={onSearch}
        enterButton
        style={{ margin: "20px 0", width: "20%" }}
      />

      <Table
        pagination={customPagination()}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },

          {
            title: "Name Project",
            dataIndex: "projectName",
            key: "projectName",
            width: "20%",
          },
          {
            title: "Category",
            dataIndex: "categoryName",
            key: "categoryName",
          },
          {
            title: "Members",
            dataIndex: "members",
            key: "members",
            render: (members, record) => (
              <div style={{ display: "flex" }}>
                <Popover
                  content={
                    <Table
                      // onMouseLeave={() => setIsModalVisible(false)}
                      columns={[
                        {
                          title: "ID",
                          dataIndex: "userId",
                          key: "userId",
                        },
                        {
                          title: "Avatar",
                          dataIndex: "avatar",
                          key: "avatar",
                          render: (avatar) => (
                            <>
                              <img
                                style={{
                                  border: "1px solid #f98",
                                  borderRadius: "50%",
                                  width: "26px",
                                  height: "26px",
                                }}
                                src={avatar}
                                alt="piture members"
                              />
                            </>
                          ),
                        },

                        {
                          title: "Name",
                          key: "name",
                          dataIndex: "name",

                          render: (name) => (
                            <>
                              <Tag color="orange" key={name}>
                                {name.toUpperCase()}
                              </Tag>
                            </>
                          ),
                        },
                        {
                          title: "Action",
                          key: "action",
                          render: (id, record) => (
                            <Space size="middle">
                              <CloseCircleOutlined
                                onClick={() => handelRemoveUser(record.userId)}
                                style={{ fontSize: "25px", color: "red" }}
                              />
                            </Space>
                          ),
                        },
                      ]}
                      dataSource={userProject}
                      pagination={false}
                    />
                  }
                  title="Members"
                >
                  <div
                    style={{
                      display: "inline",
                      margin: "0 2.5px",
                    }}
                  >
                    <Avatar.Group
                      maxCount={2}
                      maxPopoverPlacement="none"
                      maxStyle={{
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                      }}
                    >
                      {members.map(({ name, avatar, userId }) => {
                        return (
                          <>
                            <Avatar
                              onMouseEnter={() => showModal(record.id)}
                              size={32}
                              src={avatar}
                              key={userId}
                              alt={name}
                            />
                          </>
                        );
                      })}
                    </Avatar.Group>
                  </div>
                </Popover>

                <PlusCircleOutlined
                  onClick={() => {
                    setIsVisible(true);
                    setAddUser(record.id);
                  }}
                  style={{
                    fontSize: "30px",
                    color: "#f34",
                    margin: "0 2.5px",
                    paddingBottom: "10px",
                  }}
                />

                <Modal
                  title="Add User"
                  centered
                  visible={isVisible}
                  onCancel={() => {setIsVisible(false);setCloneDataUserAdd("")}}
                  width={500}
                  footer={null}
                >
                  <Search
                    placeholder="input search text"
                    onSearch={onSearchUserPro}
                    enterButton
                    style={{ width: "50%" }}
                  />
                  <div>
                    <Divider />

                    <Table
                      rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                      }}
                      columns={[
                        {
                          title: "User id",
                          dataIndex: "userId",
                        },
                        {
                          title: "Name",
                          dataIndex: "name",
                        },
                      ]}
                      dataSource={cloneDataUserAdd}
                      pagination={false}
                    />

                    <Button
                      type="primary"
                      style={{
                        margin: "auto",
                        display: "block",
                        marginTop: "20px",
                      }}
                      onClick={() => handelAddUserPro()}
                    >
                      Add User
                    </Button>
                  </div>
                </Modal>
              </div>
            ),
          },
          {
            title: "Creator",
            key: "creator",
            dataIndex: "creator",

            render: (creator) => (
              <>
                <Tag color="orange" key={creator["name"]}>
                  {creator["name"].toUpperCase()}
                </Tag>
              </>
            ),
          },
          {
            title: "Action",
            key: "action",
            render: (text, record) => (
              <Space size="middle">
                <Button
                  type="primary"
                  onClick={() => {
                    setVisible(true);
                    handleEditProject(record);
                  }}
                >
                  <FormOutlined />
                </Button>
                <Modal
                  title="Edit project"
                  centered
                  visible={visible}
                  onCancel={() => setVisible(false)}
                  width={700}
                  footer={null}
                >
                  <Form
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    layout="vertical"
                  >
                    <Form.Item
                      name="id"
                      label="Project id"
                      rules={[{ required: true }]}
                    >
                      <Input disabled={true} />
                    </Form.Item>
                    <Form.Item
                      name="projectName"
                      label="Project name"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="categoryId"
                      label="Project category"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select a option and change input text above"
                        allowClear
                      >
                        {typeProject.map((item) => {
                          return (
                            <Option value={item.id} key={item.id}>
                              {item.projectCategoryName}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      style={{ marginBottom: 5, display: "block" }}
                      label="Description"
                      name="description"
                    >
                      <div>
                        <Editor
                          apiKey="a2dm5qu81i3x9zwq6k87g28uwoz2dwhi3nbaplumzqv9a8np"
                          onInit={(evt, editor) => (editorRef.current = editor)}
                          initialValue={form.getFieldValue("description")}
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
                      </div>
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ margin: "0 20px" }}
                      >
                        Update Project
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => handelDeletePro(record.id)}
                >
                  <Button type="danger">
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        dataSource={data.length ? data : ""}
      />
    </Layout>
  );
}
