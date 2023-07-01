import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Layout from "../../components/Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import {
  Button,
  Table,
  Space,
  Form,
  Row,
  Col,
  Modal,
  TextArea,
  Input,
} from "antd";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getAllPatients, updatePatient } from "../../api/api";
import {
  EyeFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
  EditOutlined,
  EditFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // search
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [table, setTable] = useState(false);
  const [datas, setData] = useState();
  const [showopen, setShowOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [searchedText, setSearchedText] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const { data, isLoading } = useQuery({
    queryFn: getAllPatients,
    queryKey: ["patients"],
  });

  const isMobile = useMediaQuery({ query: "(max-width: 1172px)" });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1171px)" });

  const patients = data?.data?.patients;

  console.log("Patient", patients);

  const logicTable = (record) => {
    setData(record);
    setTable(!table);
  };

  const divStyle = {
    opacity: table ? 1 : 0,
    transition: table ? "opacity 4s ease-in-out 3s" : "none",
  };

  // const getUsersData = async () => {
  //   try {
  //     dispatch(showLoading());
  //     const response = await axios.get(
  //       '/api/admin/get-all-users',

  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  //     dispatch(hideLoading());
  //     if (response.data.success) {
  //       setUsers(response.data.data);
  //       setTotalPages(response.totalPages);
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //   }
  // };

  // const updateUserPermissions = async (user, action) => {
  //   try {
  //     let payload = null;
  //     if (action === 'make-doctor') {
  //       payload = {
  //         ...user,
  //         isApplyDoctor: true,
  //       };
  //     } else if (action === 'remove-admin') {
  //       payload = {
  //         ...user,
  //         isApplyDoctor: false,
  //       };
  //     } else if (action === 'block') {
  //       payload = {
  //         ...user,
  //         isBlocked: true,
  //       };
  //     } else if (action === 'unblock') {
  //       payload = {
  //         ...user,
  //         isBlocked: false,
  //       };
  //     }

  //     dispatch(showLoading());
  //     const response = await axios.post(
  //       '/api/admin/update-user-permissions',
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  //     dispatch(hideLoading());
  //     if (response.data.success) {
  //       getUsersData();
  //       toast.success(response.data.message);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //     toast.error(error.message);
  //   }
  // };

  // useEffect(() => {
  //   getUsersData();
  // }, []);

  const updateMutation = useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
      setEditModal(false);
    },
  });

  const onFinishEdit = async (values) => {
    updateMutation.mutate({
      patientAccount: { patientAccount: values },
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

  const columnsMobile = [
    {
      title: "Name",
      // render: (_, record) => `${record.firstname} ${record.lastname}`,
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
                  <b>Name:</b> {datas.firstname}
                  {datas.lastname}
                </h6>
                <p>
                  <b>Email:</b> {datas.email}
                </p>
                <p>
                  <b>PhoneNumber:</b> {datas.mobileNumber}
                </p>
                <p>
                  <b>Address:</b> {datas.address}
                </p>
                <p>
                  <b>Gender:</b> {datas.gender}
                </p>
                <p>
                  <b>Birthday:</b>{" "}
                  {new Date(datas.birthday).toLocaleDateString("en-GB")}
                </p>
                <Space>
                  <Button
                    onClick={() => {
                      editPatient(record);
                    }}
                    type="primary"
                  >
                    <EditFilled />
                  </Button>

                  {/* <Button
              onClick={() => navigate(`/patient-profile-admin/${record._id}`)}
              type="primary"
              danger
            >
              <DeleteOutlined />
            </Button> */}

                  <Button
                    onClick={() =>
                      navigate(`/patient-profile-admin/${record._id}`)
                    }
                    style={{ backgroundColor: "rgba(0, 86, 86, 1)" }}
                  >
                    <EyeFilled style={{ color: "white" }} />
                  </Button>
                </Space>

                {/* <Button
                  type="primary"
                  danger={record.status !== "blocked"}
                  onClick={() =>
                    updateStatus(
                      record.status === "blocked" ? "approved" : "blocked",
                      record._id
                    )
                  }
                >
                  {record.status === "blocked" ? "Unblock" : "Block"}
                </Button> */}
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

  const columns = [
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
      render: (_, record) => `${record.firstname} ${record.lastname}`,
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
      title: "Actions",
      dataIndex: "action",
      render: (action, record) => (
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

            {/* <Button
              onClick={() => navigate(`/patient-profile-admin/${record._id}`)}
              type="primary"
              danger
            >
              <DeleteOutlined />
            </Button> */}

            <Button
              onClick={() => navigate(`/patient-profile-admin/${record._id}`)}
              style={{ backgroundColor: "rgba(0, 86, 86, 1)" }}
            >
              <EyeFilled style={{ color: "white" }} />
            </Button>
          </Space>
          {/* {record?.isBlocked && (
            <Button type="primary" className="underline" onClick={() => {}}>
              UnBlock
            </Button>
          )}
          {!record?.isBlocked && (
            <Button
              type="primary"
              danger
              className="underline"
              onClick={() => {}}
            >
              Block
            </Button>
          )}
          {record?.isApplyDoctor && (
            <Button
              type="primary"
              danger
              className="underline"
              onClick={() => {}}
            >
              Remove Doctor
            </Button>
          )}
          {!record?.isApplyDoctor && (
            <Button type="primary" className="underline" onClick={() => {}}>
              Make Doctor
            </Button>
          )} */}
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-header">Patient Lists</h1>
        <Modal
          title="Edit Patient"
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

        {!isMobile && (
          <Table
            columns={columns}
            dataSource={patients}
            pagination={{
              pageSize: 7,
              total: patients?.length,
            }}
          />
        )}
        {!isBigScreen && (
          <Table
            columns={columnsMobile}
            dataSource={patients}
            pagination={{ pageSize: 7, total: patients?.length }}
          />
        )}
      </Layout>
    </React.Fragment>
  );
};

export default UsersList;
