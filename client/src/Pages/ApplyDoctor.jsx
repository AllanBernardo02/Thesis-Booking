import { Button, Col, Form, Input, Row, TimePicker } from 'antd';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DoctorForm from '../components/DoctorForm';
import moment from 'moment';
import { getUserProfile, userInfo } from '../redux/userSlice';
import { useMutation } from 'react-query';
import { updateDoctorProfile } from '../api/api';

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const doctorProfile = useSelector(getUserProfile);
  console.log(doctorProfile);

  const mutation = useMutation({
    mutationFn: updateDoctorProfile,
    onSuccess: (data) => {
      dispatch(userInfo(data.data.doctor));
    },
  });

  const onFinish = async (values) => {
    mutation.mutate({ id: doctorProfile._id, values });
  };

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-title">Doctor Information</h1>
        <hr />
        <DoctorForm onFinish={onFinish} />
      </Layout>
    </React.Fragment>
  );
};

export default ApplyDoctor;
// <Form layout="vertical" onFinish={onFinish}>
//           <h1 className="card-title mt-3">Personal Information</h1>

//           <Row gutter={20}>
//             <Col span={8} xs={24} sm={24} lg={8}>
//               <Form.Item
//                 required
//                 label="First Name"
//                 name="firstName"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="First Name" />
//               </Form.Item>
//             </Col>

//             <Col span={8} xs={24} sm={24} lg={8}>
//               <Form.Item
//                 required
//                 label="Last Name"
//                 name="lastName"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Last Name" />
//               </Form.Item>
//             </Col>

//             <Col span={8} xs={24} sm={24} lg={8}>
//               <Form.Item
//                 required
//                 label="Phone Number"
//                 name="phoneNumber"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Phone Number" />
//               </Form.Item>
//             </Col>

//             <Col span={8} xs={24} sm={24} lg={8}>
//               <Form.Item
//                 required
//                 label="Address"
//                 name="address"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Address" />
//               </Form.Item>
//             </Col>
//           </Row>
//           <hr />
//           <h1 className="card-title mt-3">Professional Information</h1>

//           <Row gutter={20}>
//             <Col span={8} xs={24} sm={24} lg={8}>
//               <Form.Item
//                 required
//                 label="Specialization"
//                 name="specialization"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Specialization" />
//               </Form.Item>
//             </Col>

//             <Col span={8} xs={24} sm={24} lg={8}>
//               <Form.Item
//                 required
//                 label="Experience"
//                 name="experience"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Experience" type="number" />
//               </Form.Item>
//             </Col>

//             <Col span={8} xs={24} sm={24} lg={8}>
//               <Form.Item
//                 required
//                 label="Fee Per Consultation"
//                 name="feeConsultation"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Fee Per Consultation" type="number" />
//               </Form.Item>
//             </Col>

//             <Col span={8} xs={24} sm={24} lg={8}>
//               <Form.Item
//                 required
//                 label="Daily Hours"
//                 name="timings"
//                 rules={[{ required: true }]}
//               >
//                 <TimePicker.RangePicker use12Hours />
//               </Form.Item>
//             </Col>

//             {/*<Col span={8} xs={24} sm={24} lg={8}>
//               <Form.Item label="Gcash QR Code" name="selectedFile">
//                 <FileBase type="file" multiple={false} />
//               </Form.Item>
//   </Col>*/}
//           </Row>

//           <div className="d-flex justify-content-end">
//             <Button className="primary-button" htmlType="submit">
//               Submit
//             </Button>
//           </div>
//         </Form>
