import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../hocs/layout/layout";
import { Table, Space, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../stores/action/user";
import { Modal, Button } from "antd";
import { Form, Input } from "antd";
import { cybersoftKey } from "../../stores/action/types";
import { errorAlert, successAlert } from "../../helpers/swal";
import axios from "axios";

export default function User() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { Search } = Input;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const fetUser = useCallback(() => {
    dispatch(fetchUser(""));
  }, [dispatch]);
  const onSearch = useCallback(
    (value) => {
      dispatch(fetchUser(value));
    },
    [dispatch]
  );

  useEffect(() => {
    fetUser();
  }, [fetUser]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await axios({
          url: "https://jiranew.cybersoft.edu.vn/api/Users/deleteUser",
          method: "DELETE",
          headers: {
            TokenCybersoft: cybersoftKey.PM_key,
            Authorization: "Bearer " + localStorage.getItem("isLogin"),
          },
          params: { id },
        });
       

        successAlert("Delete in successfully");
      } catch (err) {
        const showErr = { ...err };
        errorAlert(showErr.response.data.content);
      }

      fetUser();
    },

    [fetUser]
  );

  const customPagination = () => {
    return {
      total: data.length,
      defaultPageSize: 7,
      showSizeChanger: false,
    };
  };

  const data = useSelector((state) => {
    return state.users.users;
  });
  
  const showModal = (data) => {
    setVisible(true);
    form.setFieldsValue({
      email: data.email,
      userId: data.userId,
      name: data.name,
      phone: data.phoneNumber,
    });
  };

  const onFinish = useCallback(
    async (value) => {
      const data = {
        id: value.userId,
        name: value.name,
        passWord: value.passWord,
        email: value.email,
        phoneNumber: value.phoneNumber,
      };
      try {
        await axios({
          url: "https://jiranew.cybersoft.edu.vn/api/Users/editUser",
          method: "PUT",
          headers: {
            TokenCybersoft: cybersoftKey.PM_key,
          },
          data: data,
        });
       

        successAlert("Update in successfully");
      } catch (err) {
        const showErr = { ...err };
        errorAlert(showErr.response.data.content);
      }

      fetUser();
      setTimeout(() => {
        setVisible(false);
        setConfirmLoading(false);
      }, 2000);
    },
    [fetUser]
  );
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Layout>
      <h2>User Management</h2>
      <Space direction="vertical">
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
          style={{ margin: "20px 0" }}
        />
      </Space>
      <Table
        pagination={customPagination()}
        columns={[
          {
            title: "ID",
            dataIndex: "userId",
            key: "userId",
          },
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "PhoneNumber",
            key: "phoneNumber",
            dataIndex: "phoneNumber",
          },
          {
            title: "Action",
            key: "action",
            render: (text, record) => (
              <Space size="middle">
                <Button
                  onClick={() => {
                    showModal(record);
                  }}
                  type="primary"
                >
                  Edit
                </Button>
                <Modal
                  title="Info Sign Up"
                  visible={visible}
                  confirmLoading={confirmLoading}
                  onCancel={handleCancel}
                  footer={null}
                >
                  <p>
                    {
                      <Form form={form} name="register" onFinish={onFinish}>
                        <Form.Item
                          name="userId"
                          label="userId"
                          labelAlign="left"
                        >
                          <Input disabled={true} />
                        </Form.Item>
                        <Form.Item
                          name="email"
                          label="E-mail"
                          labelAlign="left"
                          rules={[
                            {
                              type: "email",
                              message: "The input is not valid E-mail!",
                            },
                            {
                              required: true,
                              message: "Please input your E-mail!",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          name="password"
                          label="Password"
                          labelAlign="left"
                          rules={[
                            {
                              required: true,
                              message: "Please input your password!",
                            },
                            {
                              min: 5,
                              message:
                                "Please input your password is less five words!",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input.Password />
                        </Form.Item>
                        <Form.Item
                          name="name"
                          label="Name"
                          labelAlign="left"
                          tooltip="What do you want others to call you?"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Name!",
                              whitespace: true,
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          name="phone"
                          label="Phone Number"
                          labelAlign="left"
                          rules={[
                            {
                              required: true,
                              message: "Please input your phone number!",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  /(0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)
                                ) {
                                  return Promise.resolve();
                                }

                                return Promise.reject(
                                  new Error("phone must have 10 numbers")
                                );
                              },
                            }),
                          ]}
                        >
                          <Input
                            style={{
                              width: "100%",
                            }}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{ display: "block", margin: "auto" }}
                          >
                            Up Date
                          </Button>
                        </Form.Item>
                      </Form>
                    }
                  </p>
                </Modal>
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => handleDelete(record.userId)}
                >
                  <Button type="danger">Delete</Button>
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
