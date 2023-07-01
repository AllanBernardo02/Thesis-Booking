import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { ReactReduxContext, useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Form,
  Modal,
  Input,
  Space,
  Select,
} from "antd";
import toast from "react-hot-toast";
import { DeleteFilled, EditFilled, EyeFilled } from "@ant-design/icons";
import { getUserProfile } from "../../redux/userSlice";
import { useQuery } from "react-query";
import { getDoctorSchedule } from "../../api/api";

const PatientProfileAdmin = () => {
  // const BASE_URL = "http://localhost:5000/api";
  const BASE_URL = "https://starwheal.onrender.com/api";

  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  const [patients, setPatients] = useState(null);
  const [patientConsultation, setPatientConsultation] = useState([]);
  const [services, setServices] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [clinicService, setClinicService] = useState([]);
  const [opens, setOpens] = useState(false); // modal
  const [showopen, setShowOpen] = useState(false); //modal edit
  const [editingPatient, setEditingPatient] = useState(null);
  const [totalPages, setTotalPages] = useState(1); //pagination
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  // const { user } = useSelector((state) => state.user);
  const user = useSelector(getUserProfile);
  const navigate = useNavigate();
  const { doctorId } = useParams();

  console.log("Nakuha naba ang Service?", patientConsultation);

  const serv = [
    {
      name: "Check-UP",
    },
    {
      name: "Rabies Vaccine",
    },
    {
      name: "Flu Vaccine",
    },
    {
      name: "Pneumonia Vaccine",
    },
    {
      name: "Earpiercings",
    },
    {
      name: "Medical Certificate",
    },
    {
      name: "Circumcision",
    },
  ];

  const clinicName = clinicService.map((name) => {
    return <h1>{name.serviceName}</h1>;
  });

  // let date = patientData.createdAt;
  // const newDate = date.split("T")[0];
  // setPatientData(newDate);

  const getPatientData = async () => {
    dispatch(showLoading());
    try {
      dispatch(showLoading());
      const response = await api.post(
        `/admin/get-patient-info-by-id`,
        {
          patientId: params.patientId,
          // userId: user,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("ANO BA KASI", params.patientId);
      dispatch(hideLoading());
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await api.post(
        "/admin/patient-consulation-history",
        {
          ...values,
          userId: user._id,
          patientId: patients._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPatientConsultation([...patientConsultation, { ...values }]);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        // navigate(`/patient-record/${patients._id}`);
      }
    } catch (error) {}
  };

  //get patient consulatation
  const getPatientConsulatation = async () => {
    try {
      dispatch(showLoading());
      const response = await api.post(
        "/admin//get-patient-consultations-history-admin",
        {
          // patientId: patients._id,
          patientId: params.patientId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setPatientConsultation(response.data.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const onFinishEdit = async (values) => {
    setShowOpen(false);
    try {
      dispatch(showLoading());
      const response = await api.patch(
        `/admin/update-patient-profile/${editingPatient._id}`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPatientConsultation(
        patientConsultation.map((val) => {
          return val._id === editingPatient._id ? values : val;
        })
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        // navigate("/admin/patient-record");
        // navigate(`/patient-profile/${editingPatient._id}`);
      }
    } catch (error) {}
  };

  const deletePatient = (id) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this patient?",

      onOk: () => {
        try {
          const response = api
            .delete(`/admin/delete-patient-record/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then(() => {
              // setPatients(patients.splice([...patients], 1));

              // setPatients([...patients]);
              // const deletedPatientId = patients.findIndex(
              //   (patient) => patient._id === id
              // );
              // const newPatientList = [...patients].splice(deletedPatientId);
              // setPatients(newPatientList);

              setPatientConsultation(
                patientConsultation.filter((val) => {
                  return val._id !== id;
                })
              );
            });

          if (response.data.success) {
            console.log("Success?", response.data.success);

            toast.success(response.data.message);
          }
        } catch (error) {}
      },
    });
  };

  console.log("Anong Mali?", patientConsultation);

  //modal

  const showModal = () => {
    setOpens(true);
  };

  const hideModal = () => {
    setOpens(false);
  };

  const showViewModal = async (record) => {
    setOpenModal(true);
    setPatientData(record);
    // try {
    //   dispatch(showLoading());
    //   const response = await axios.post(
    //     "/api/admin/get-patient-consultation-history-by-id",
    //     {
    //       patientId: record._id,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   );
    //   dispatch(hideLoading());
    //   if (response.data.success) {
    //     setPatientData(response.data.data);
    //   }
    // } catch (error) {}
  };

  //edit history
  const showEditModal = (record) => {
    setShowOpen(true);
    // setNewPatient({ ...record, id });

    setEditingPatient({ ...record });
  };

  const handleCancelModel = () => {
    setShowOpen(false);
    // window.location.reload(false);
  };

  const hideEditModal = () => {
    setOpenModal(false);
  };

  //onchange for select option
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const getClinicService = async () => {
    try {
      const response = await api.get("/admin/get-clinic-services", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setClinicService(response.data.data);
      }
    } catch (error) {}
  };

  //render method
  useEffect(() => {
    getPatientConsulatation();
    getPatientData();
    getClinicService();
  }, []);
  console.log("Patient info", patients);

  const columns = [
    {
      title: "Consultation Name",
      dataIndex: "consultationName",
    },
    {
      title: "Date Consulted",

      render: (text, record) => <div>{record.createdAt?.split("T")[0]}</div>,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex">
          <Space>
            <EditFilled
              style={{ color: "#08c" }}
              onClick={() => showEditModal(record)}
            />
            <DeleteFilled
              style={{ color: "#f54242" }}
              onClick={() => deletePatient(record._id)}
            />
            <EyeFilled onClick={() => showViewModal(record)} />
          </Space>
        </div>
      ),
    },
  ];

  console.log("Consultation", patientConsultation);

  return (
    <Layout>
      {patients && (
        <React.Fragment>
          <h3>Consultation History</h3>
          <hr />
          <div style={{ margin: "10px 5%", maxWidth: "90%" }}>
            <h4 style={{ color: "#005555", fontWeight: "bold" }}>
              PATIENT NAME:
              <span style={{ color: "black" }}>
                {patients.firstname} {patients.middlename} {patients.lastname}
              </span>
            </h4>
            <h5 style={{ color: "#005555", fontWeight: "bold" }}>
              Birthday:
              <span style={{ color: "black" }}>
                {new Date(patients.birthday).toLocaleDateString()}
              </span>
            </h5>
            <h5 style={{ color: "#005555", fontWeight: "bold" }}>
              Gender: <span style={{ color: "black" }}>{patients.gender}</span>
            </h5>

            <h5 style={{ color: "#005555", fontWeight: "bold" }}>
              Contact Number:{" "}
              <span style={{ color: "black" }}>{patients.mobileNumber}</span>
            </h5>

            <h5 style={{ color: "#005555", fontWeight: "bold" }}>
              Address:{" "}
              <span style={{ color: "black" }}>{patients.address}</span>
            </h5>
          </div>

          <Modal
            title="Edit Patient Details"
            open={showopen}
            onCancel={handleCancelModel}
            okText="Submit"
          >
            <Form onFinish={onFinishEdit} initialValues={{ ...editingPatient }}>
              <Row>
                <Col>
                  <Form.Item
                    required
                    label="Consultation Name"
                    name="consultationName"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Consultation Name" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="Blood Pressure"
                    name="bloodPressure"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Blood Pressure" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="Weight"
                    name="weight"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Weight" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    required
                    label="Temperature"
                    name="temparature"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Temperature" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="Pulse Rate"
                    name="pulseRate"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Pulse Rate" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="02 Saturation"
                    name="twoSaturation"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="02 Saturation" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    required
                    label="Height"
                    name="height"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Height" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="Respiratory Rate"
                    name="respiratoryRate"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Respiratory Rate" />
                  </Form.Item>
                </Col>
              </Row>
              <Button className="primary-button" htmlType="submit">
                Submit
              </Button>
            </Form>
          </Modal>

          <div
            style={{
              margin: "10px 5%",
              maxWidth: "90%",
            }}
          >
            <Table
              columns={columns}
              dataSource={patientConsultation}
              pagination={{
                pageSize: 4,
                total: patientConsultation?.length,
              }}
            />
            {/* <div className="text-end">
              <Button
                onClick={showModal}
                style={{
                  backgroundColor: "rgba(0, 86, 86, 1)",
                  color: "white",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              >
                ADD CONSULTATION
              </Button>
              <Button
                onClick={showModal}
                style={{
                  color: "rgba(0, 86, 86, 1)",
                  marginLeft: "10px",
                  marginBottom: "10px",
                }}
              >
                GO BACK
              </Button>
            </div> */}
          </div>
          <Modal
            open={opens}
            title="Add Consultation Data"
            onCancel={hideModal}
          >
            <Form onFinish={onFinish}>
              <Row>
                <Col>
                  <Form.Item
                    required
                    label="Consultation Name"
                    name="consultationName"
                    rules={[{ required: true }]}
                  >
                    <select>
                      <option></option>
                      {serv.map((name) => (
                        <option>{name.name}</option>
                      ))}
                    </select>
                  </Form.Item>

                  <Form.Item
                    required
                    label="Blood Pressure"
                    name="bloodPressure"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Blood Pressure" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="weight"
                    name="weight"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Weight" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="Temperature"
                    name="temparature"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Temperature" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="Pulse Rate"
                    name="pulseRate"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Pulse Rate" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="02 Saturation"
                    name="twoSaturation"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="02 Saturation" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="Height"
                    name="height"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Height" />
                  </Form.Item>
                  <Form.Item
                    required
                    label="Respiratory Rate"
                    name="respiratoryRate"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Respiratory Rate" />
                  </Form.Item>
                </Col>
              </Row>
              <Button className="primary-button" htmlType="submit">
                Submit
              </Button>
            </Form>
          </Modal>

          <Modal open={openModal} onCancel={hideEditModal}>
            {patientData && (
              <React.Fragment>
                <h2>Details</h2>
                <hr />
                <div className="d-flex">
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Consultation Name :
                  </h5>
                  <h5>{patientData.consultationName}</h5>
                </div>
                <div className="d-flex">
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Blood Pressure :
                  </h5>
                  <h5>{patientData.bloodPressure}</h5>
                </div>
                <div className="d-flex">
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Weight :
                  </h5>
                  <h5>{patientData.weight}</h5>
                </div>
                <div className="d-flex">
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Temperature :
                  </h5>
                  <h5>{patientData.temparature}</h5>
                </div>
                <div className="d-flex">
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Pulse Rate :
                  </h5>
                  <h5>{patientData.pulseRate}</h5>
                </div>
                <div className="d-flex">
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    02 Saturation :
                  </h5>
                  <h5>{patientData.twoSaturation}</h5>
                </div>
                <div className="d-flex">
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Height :
                  </h5>
                  <h5>{patientData.height}</h5>
                </div>
                <div className="d-flex">
                  <h5 style={{ color: "#005555", fontWeight: "bold" }}>
                    Respiratory Rate :
                  </h5>
                  <h5>{patientData.respiratoryRate}</h5>
                </div>
              </React.Fragment>
            )}
          </Modal>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default PatientProfileAdmin;
