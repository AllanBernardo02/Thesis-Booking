import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { Button, Table, Space, Input, Form, Modal, Row, Col } from "antd";
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { getAllDoctorPatients, updatePatientDoctor } from "../../api/api";
import { getUserProfile } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [table, setTable] = useState(false);
  const [datas, setData] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [searchedText, setSearchedText] = useState(""); // search
  const [editModal, setEditModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const user = useSelector(getUserProfile);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryFn: () => getAllDoctorPatients(user._id),
    queryKey: ["doctor-patients"],
  });

  const patients = data?.data?.patients;

  const isMobile = useMediaQuery({ query: "(max-width: 1172px)" });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1171px)" });

  const divStyle = {
    opacity: table ? 1 : 0,
    transition: table ? "opacity 4s ease-in-out 3s" : "none",
  };

  const logicTable = (record) => {
    setData(record);
    setTable(!table);
  };

  const updateMutation = useMutation({
    mutationFn: updatePatientDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctor-patients"]);
      setEditModal(false);
    },
  });

  const onFinishEdit = async (values) => {
    updateMutation.mutate({
      patientAccountDoctor: { patientAccountDoctor: values },
      id: editingPatient._id,
    });
  };

  const editPatient = (record) => {
    setEditingPatient(record);
    setEditModal(true);
  };

  const hideEditModal = () => {
    setEditModal(false);
  };

  const columns = [
    {
      title: "Name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.firstname)
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          String(record.middlename)
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          String(record.lastname)?.toLowerCase()?.includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      render: (text) => new Date(text).toISOString().split("T")[0],
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex">
          <Space>
            <Button
              onClick={() => {
                editPatient(record);
              }}
              type="primary"
            >
              <EditFilled />
            </Button>
            <Button
              onClick={() => navigate(`/patient-profile/${record._id}`)}
              style={{ backgroundColor: "rgba(0, 86, 86, 1)" }}
            >
              <EyeFilled style={{ color: "white" }} />
            </Button>
          </Space>
        </div>
      ),
    },
  ];

  const columns1 = [
    {
      title: "Name",
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.firstname)
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          String(record.middlename)
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          String(record.lastname)?.toLowerCase()?.includes(value.toLowerCase())
        );
      },
      render: (_, record) =>
        table === true ? (
          <div style={divStyle}>
            {" "}
            {datas._id === record._id ? (
              <>
                <h6>
                  <b>Name:</b> {datas.firstname} {datas.lastname}
                </h6>
                <p>
                  <b>Email:</b> {datas.email}
                </p>
                <p>
                  <b>Gender:</b> {datas.gender}
                </p>
                <p>
                  <b>Mobile:</b> {datas.mobileNumber}
                </p>
                <p>
                  <b>Birthday:</b> {datas.birthday.split("T")[0]}
                </p>
                <p>
                  <b>Address:</b> {datas.address}
                </p>

                <div className="d-flex">
                  <Space>
                    <Button
                      onClick={() => navigate(`/patient-profile/${record._id}`)}
                    >
                      View
                    </Button>
                  </Space>
                </div>
              </>
            ) : (
              <>
                <p>
                  {record.firstname} {record.lastname}
                </p>
              </>
            )}
          </div>
        ) : (
          `${record.firstname} ${record.lastname}`
        ),
    },
    {
      title: "Action",
      render: (text, record) => {
        return (
          <Button onClick={() => logicTable(record)}>
            {table === true ? <EyeInvisibleOutlined /> : <EyeFilled />}
          </Button>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-header">Patient List</h1>
        {/* <Table
          columns={columns}
          dataSource={patients}
          pagination={{
            pageSize: 5,
            total: totalPages,
          }}
        /> */}

        <Modal
          title="Edit Patient Record"
          open={editModal}
          onCancel={hideEditModal}
          footer={null}
        >
          <Form onFinish={onFinishEdit} initialValues={{ ...editingPatient }}>
            <Row>
              <Col>
                <Form.Item
                  required
                  label="First Name"
                  name="firstname"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item
                  required
                  label="Last Name"
                  name="lastname"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
                <Form.Item
                  required
                  label="Gender"
                  name="gender"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Gender" />
                </Form.Item>
                <Form.Item
                  required
                  label="Mobile Number"
                  name="mobileNumber"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Mobile Number" />
                </Form.Item>
                <Form.Item
                  required
                  label="BirthDay"
                  name="birthday"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="BirthDay" />
                </Form.Item>
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
            <Button className="primary-button" htmlType="submit">
              Update
            </Button>
          </Form>
        </Modal>

        <Input.Search
          placeholder="Search here..."
          style={{ marginBottom: 8 }}
          onSearch={(value) => {
            setSearchedText(value);
          }}
          onChange={(e) => {
            setSearchedText(e.target.value);
          }}
          inputStyle={{ borderRadius: "20px" }}
        />

        {!isBigScreen && (
          <Table
            columns={columns1}
            dataSource={patients}
            pagination={{
              pageSize: 6,
              total: totalPages,
            }}
          />
        )}
        {!isMobile && (
          <Table
            columns={columns}
            dataSource={patients}
            pagination={{
              pageSize: 6,
              total: totalPages,
            }}
          />
        )}
      </Layout>
    </React.Fragment>
  );
};

export default UsersList;
