import React, { useCallback } from "react";
import { Form, Input, Button, Typography } from "antd";
import logo from "../../assets/img/logo.svg";
import "./style.css";
import bg from "../../assets/img/blue_wave_background.svg";
import { useForm } from "react-hook-form";
import { NavLink,useHistory } from "react-router-dom";
import { errorAlert, successAlert } from "../../helpers/swal";
import { request } from "../../api/request";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 9,
    },
  },
};
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
export default function Signup() {
  const history = useHistory();
  const { reset } = useForm();
  const [form] = Form.useForm();
  const { Title } = Typography;
  const onFinish = useCallback(async(values)=>{
    console.log("Received values of form: ", values);
    const formData = {
      email: values.email,
      passWord: values.password,
      name: values.name,
      phoneNumber: values.phone,
    };
    
      try {
        const res = await request({
          url: "https://jiranew.cybersoft.edu.vn/api/Users/signup",
          method: "POST",
          data: formData,
        });
        console.log(res);
        successAlert("Sign up success!");
        form.resetFields();
        history.push('/');
      } catch (err) {
        const errMess = { ...err };
        console.log(errMess);
        errorAlert(errMess.response.data.message);
      }
    
  },[form,history])

  return (
    <div className="bg-signup" style={{ backgroundImage: `url(${bg})` }}>
      <div className="logo">
        <img  src={logo} alt="logo"></img>
      </div>
      <div className="signup-form">
        <Title style={{ textAlign: "center" }} level={1}>
          Sign up
        </Title>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          onClick={() => reset()}
        >
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
                message: "Please input your password is less five words!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            labelAlign="left"
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
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
                  if (/(0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)) {
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

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" style={{marginRight:"5px"}}>
              Sign Up
            </Button> 
             Or <NavLink to="/">Sign in now</NavLink>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
