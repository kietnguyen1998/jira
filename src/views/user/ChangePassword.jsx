import React, { useCallback, useEffect } from "react";
import Layout from "../../hocs/layout/layout";
import { Button } from "antd";
import { Form, Input } from "antd";
import axios from "axios";
import { cybersoftKey } from "../../stores/action/types";
import { errorAlert, successAlert } from "../../helpers/swal";
import { fetchUser } from "../../stores/action/user";
import { useDispatch, useSelector } from "react-redux";
export default function ChangePassword() {
  const dispatch = useDispatch();
  const isMeoloveBe = JSON.parse(localStorage.getItem("isMeoLoveBe"));

  const fetUser = useCallback(() => {
    dispatch(fetchUser(isMeoloveBe.id));
  }, [dispatch, isMeoloveBe.id]);

  useEffect(() => {
    fetUser();
  }, [fetUser]);
  const data = useSelector((state) => state.users.users);
  const cloneData = { ...data[0] };

  const [form] = Form.useForm();
  const onFinish = useCallback(async (value) => {
   
    const data = {
      id: cloneData.userId,
      name: cloneData.name,
      passWord: value.password,
      email: cloneData.email,
      phoneNumber: cloneData.phoneNumber,
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
  }, [cloneData.email, cloneData.name, cloneData.phoneNumber, cloneData.userId]);
  return (
    <Layout>
      <p>Change PassWord</p>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        style={{ width: "50%", margin: "auto" }}
      >
        <Form.Item
          name="password"
          label="Password"
          labelAlign="left"
          width=""
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              min: 5,
              message: "Please input your password is less five words!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
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
      
    </Layout>
  );
}
