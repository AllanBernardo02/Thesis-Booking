import { Form, Row, Col, Input, Button } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { getUserProfile } from "../redux/userSlice";

const PatientForm = ({ onFinish, initivalValues }) => {
  //   const patientProfile = useSelector(getUserProfile);
  return (
    <Form
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...initivalValues }}
    >
      {/* <h1 className="card-title mt-3">Patient Profile</h1> */}
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="First Name"
            name="firstname"
            rules={[{ required: true }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Last Name"
            name="lastname"
            rules={[{ required: true }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Email"
            name="email"
            rules={[{ required: true }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        </Col>
        {/* <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input placeholder="Password" />
          </Form.Item>
        </Col> */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Birthday"
            name="birthday"
            rules={[{ required: true }]}
          >
            <Input placeholder="Birthday" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Gender"
            name="gender"
            rules={[{ required: true }]}
          >
            <Input placeholder="Gender" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Mobile Number"
            name="mobileNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Password" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        <Button className="primary-button" htmlType="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default PatientForm;
