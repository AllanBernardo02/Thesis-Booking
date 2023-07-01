import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Table,
  Collapse,
  Space,
} from "antd";
import { useMediaQuery } from "react-responsive";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  EditFilled,
  EyeFilled,
  EyeInvisibleOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createDoctorAccount,
  getAllActiveDoctors,
  getAllDoctors,
  updateDoctorAccount,
  updateDoctorStatus,
} from "../../api/api";

const DoctorAccount = () => {
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState(false);
  const [datas, setData] = useState();
  const [editingDoctor, setEditingDoctor] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [account, setAccount] = useState();
  const user = useSelector((state) => state.user);
  const [searchedText, setSearchedText] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const isMobile = useMediaQuery({ query: "(max-width: 1172px)" });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1171px)" });
  const { Panel } = Collapse;

  const { data, isLoading } = useQuery({
    queryFn: getAllDoctors,
    queryKey: ["doctors"],
  });

  const doctors = data?.data?.doctors;

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const mutation = useMutation({
    mutationFn: createDoctorAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      queryClient.invalidateQueries(["all-active-doctors"]);
      hideModal();
      toast.success("Successfully added a new doctor", { duration: 2000 });
    },
  });

  const addDoctor = (values) => {
    mutation.mutate(values);
    form.resetFields();
  };

  const statusMutation = useMutation({
    mutationFn: updateDoctorStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      queryClient.invalidateQueries(["all-active-doctors"]);
      toast.success("Status updated");
    },
    onError: () => {
      toast.error("Error updating status", { duration: 2000 });
    },
  });

  const updateStatus = (name, id) => {
    console.log(name);
    statusMutation.mutate({ id, values: { status: name } });
  };

  const logicTable = (record) => {
    setData(record);
    setTable(!table);
  };

  const divStyle = {
    opacity: table ? 1 : 0,
    transition: table ? "opacity 4s ease-in-out 3s" : "none",
  };

  const updateMutation = useMutation({
    mutationFn: updateDoctorAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      setEditModal(false);
    },
  });

  const onFinishEdit = async (values) => {
    updateMutation.mutate({
      doctorAccount: { doctorAccount: values },
      id: editingDoctor._id,
    });
  };

  const editDoctorAccount = (record) => {
    setEditingDoctor(record);
    setEditModal(true);
  };

  const hideEditModal = () => {
    setEditModal(false);
  };

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
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
    },

    {
      title: "Experience",
      dataIndex: "experience",
    },
    {
      title: "Consultation Fee",
      dataIndex: "feeConsultation",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
    },
    // {
    //   title: "Action",
    //   render: (text, record) => {
    //     const status = record.status;
    //     return (
    //       <Button
    //         type="primary"
    //         danger={status !== "blocked"}
    //         onClick={() =>
    //           updateStatus(
    //             status === "blocked" ? "approved" : "blocked",
    //             record._id
    //           )
    //         }
    //       >
    //         {status === "blocked" ? "Unblock" : "Block"}
    //       </Button>
    //     );
    //   },
    // },
    {
      title: "Action",
      dataIndex: "_id",
      render: (text, record) => (
        <React.Fragment>
          <Space wrap>
            <Button
              onClick={() => {
                editDoctorAccount(record);
              }}
              type="primary"
            >
              <EditFilled />
            </Button>
            {/* <Button
              // onClick={() => deleteClinicService(record._id)}
              type="primary"
              danger
            >
              <DeleteFilled />
            </Button> */}
          </Space>
        </React.Fragment>
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
                  <b>Name:</b> {datas.firstname}
                  {datas.lastname}
                </h6>
                <h6>
                  <b>Specialization:</b> {datas.specialization}
                </h6>
                <p>
                  <b>Email:</b> {datas.email}
                </p>
                <p>
                  <b>PhoneNumber:</b> {datas.phoneNumber}
                </p>
                <p>
                  <b>Address:</b> {datas.address}
                </p>
                <p>
                  <b>Experience:</b> {datas.experience}
                </p>
                <p>
                  <b>Fee:</b> {datas.feeConsultation}
                </p>
                <p>
                  <b>Status:</b> {datas.status}
                </p>
                <Space wrap>
                  <Button
                    onClick={() => {
                      editDoctorAccount(record);
                    }}
                    type="primary"
                  >
                    <EditFilled />
                  </Button>
                  {/* <Button
              // onClick={() => deleteClinicService(record._id)}
              type="primary"
              danger
            >
              <DeleteFilled />
            </Button> */}
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

    // {
    //   title: "Specialization",
    //   // dataIndex: table === true ? <div>{}</div> : "specialization",
    //   render: (_, record) =>
    //     table === true ? (
    //       <div>
    //         {" "}
    //         {datas._id === record._id ? null : (
    //           <>
    //             <p>{record.specialization}</p>
    //           </>
    //         )}
    //       </div>
    //     ) : (
    //       `${record.firstname} ${record.lastname}`
    //     ),
    // },

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
    <Layout>
      {/* <h1>Doctor List</h1>
      {!isMobile && (
        <Button onClick={showModal} type="primary">
          +
        </Button>
      )} */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>Doctor List</h1>
        {!isMobile && (
          <Button
            onClick={showModal}
            type="primary"
            style={{ marginLeft: "auto" }}
          >
            +
          </Button>
        )}
      </div>

      <Modal
        title="Edit Doctor Account"
        open={editModal}
        onCancel={hideEditModal}
        footer={null}
      >
        <Form onFinish={onFinishEdit} initialValues={{ ...editingDoctor }}>
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
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true }]}
              >
                <Input placeholder="Phone Number" />
              </Form.Item>
              <Form.Item
                required
                label="Specialization"
                name="specialization"
                rules={[{ required: true }]}
              >
                <Input placeholder="Specialization" />
              </Form.Item>
              <Form.Item
                required
                label="Experience"
                name="experience"
                rules={[{ required: true }]}
              >
                <Input placeholder="Experience" />
              </Form.Item>
              <Form.Item
                required
                label="Fee Consultation"
                name="feeConsultation"
                rules={[{ required: true }]}
              >
                <Input placeholder="Fee Consultation" />
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
          dataSource={doctors}
          pagination={{
            pageSize: 7,
            total: doctors?.length,
          }}
        />
      )}
      {!isMobile && (
        <Table
          columns={columns}
          dataSource={doctors}
          pagination={{
            pageSize: 7,
            total: doctors?.length,
          }}
        />
      )}

      <Modal open={open} onCancel={hideModal} footer={null}>
        <Form onFinish={addDoctor} form={form}>
          <Row>
            <Col>
              <Form.Item
                required
                label="Firstname"
                name="firstname"
                rules={[{ required: true }]}
              >
                <Input placeholder="Firstname" />
              </Form.Item>
              <Form.Item
                required
                label="Lastname"
                name="lastname"
                rules={[{ required: true }]}
              >
                <Input placeholder="Lastname" />
              </Form.Item>
              <Form.Item
                required
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                required
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                required
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true }]}
              >
                <Input placeholder="0912345" />
              </Form.Item>
              <Form.Item
                required
                label="Address"
                name="address"
                rules={[{ required: true }]}
              >
                <Input placeholder="Address" />
              </Form.Item>
              <Form.Item
                required
                label="Specialization"
                name="specialization"
                rules={[{ required: true }]}
              >
                <Input placeholder="Specialization" />
              </Form.Item>
              <Form.Item
                required
                label="Experience"
                name="experience"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="1" />
              </Form.Item>
              <Form.Item
                required
                label="Fee Consultation"
                name="feeConsultation"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="000" />
              </Form.Item>
            </Col>
          </Row>
          <Button className="primary-button" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
      {/* <Toaster /> */}
      {!isBigScreen && (
        <Col lg={6}>
          <Button shape="round" onClick={showModal} type="primary">
            +
          </Button>
        </Col>
      )}
    </Layout>
  );
};

export default DoctorAccount;
