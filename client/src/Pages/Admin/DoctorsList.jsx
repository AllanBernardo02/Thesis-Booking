import { Button, Table, Card, Col, Row } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import { toast } from 'react-hot-toast';
const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        '/api/admin/get-all-doctors',

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/admin/change-doctor-status',
        { doctorId: record._id, userId: record.userId, status: status },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorsData();
      }
    } catch (error) {
      toast.error('Someting went Wrong');
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
    },
    {
      title: 'Time',
      dataIndex: 'timings',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          {/*<h1 className="anchor">Approve</h1>*/}
          {record.status === 'pending' && (
            <Button
              type="primary"
              onClick={() => changeDoctorStatus(record, 'approved')}
            >
              Approve
            </Button>
          )}
          {record.status === 'approved' && (
            <Button
              type="primary"
              danger
              onClick={() => changeDoctorStatus(record, 'blocked')}
            >
              Block
            </Button>
          )}
        </div>
      ),
    },
  ];
  const statusApproved = doctors.filter(
    ({ status }) => status === 'approved'
  ).length;
  console.log('Approved', statusApproved);

  const statusPending = doctors.filter(
    ({ status }) => status === 'pending'
  ).length;
  console.log('Pending', statusPending);

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-header">Doctors List</h1>

        <Table
          columns={columns}
          dataSource={doctors}
          pagination={{
            pageSize: 5,
            total: totalPages,
          }}
        />
      </Layout>
    </React.Fragment>
  );
};

export default DoctorsList;
