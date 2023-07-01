import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import moment from "moment";
import React, { useState } from "react";
import FileBase from "react-file-base64";
import { useSelector } from "react-redux";
import { getUserProfile } from "../redux/userSlice";

const DoctorForm = ({ onFinish, initivalValues }) => {
  // const doctorProfile = useSelector(getUserProfile);

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ ...initivalValues }}
    >
      <h1 className="card-title mt-3">Personal Information</h1>

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
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Phone Number" />
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
      <hr />
      <h1 className="card-title mt-3">Professional Information</h1>

      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Input placeholder="Specialization" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Experience"
            name="experience"
            rules={[{ required: true }]}
          >
            <Input placeholder="Experience" type="number" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Fee Per Consultation"
            name="feeConsultation"
            rules={[{ required: true }]}
          >
            <Input placeholder="Fee Per Consultation" type="number" />
          </Form.Item>
        </Col>

        {/* <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Daily Hours"
            name="timings"
            // rules={[{ required: true }]}
          >
            <TimePicker.RangePicker format="hh:mm a" />
          </Form.Item>
        </Col> */}

        <Col span={8} xs={24} sm={24} lg={8}></Col>

        {/*<Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Gcash QR Code" name="selectedFile">
            <FileBase type="file" multiple={false} />
          </Form.Item>
    </Col>*/}
      </Row>

      <div className="d-flex justify-content-end">
        <Button className="primary-button" htmlType="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default DoctorForm;
