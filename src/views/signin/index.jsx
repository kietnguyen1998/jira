import React,{useCallback} from "react";
import { Form, Input, Button, Checkbox, Typography } from "antd";

import { UserOutlined, LockOutlined } from "@ant-design/icons";
import banner from "../../assets/img/blue_wave_background.svg";
import { NavLink,useHistory } from "react-router-dom";
import "./signin.css";
import { useDispatch } from "react-redux";
import { signIn } from "../../stores/action/me";
import logo from '../../assets/img/logo.svg'
const { Title } = Typography;

export default function Signin() {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const onFinish = useCallback((values) => {
    
    const formData = {
       email:values.Email,
       passWord:values.password,
    }

    dispatch(signIn(formData,() => {history.push('/dashboard')}));
    
  },[dispatch,history]) 

  return (
    <div
      className="background-signin"
      style={{ backgroundImage: `url(${banner})` }}
    > 
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        
      > 

        <Title style={{ textAlign: "center" }} level={2}>
          Sign in
        </Title>
        <Form.Item
          name="Email"
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
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
          
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ marginRight: 5 }}
          >
            Log in
          </Button>
          Or <NavLink to="/signup">register now!</NavLink>
        </Form.Item>
      </Form>
    </div>
  );
}
