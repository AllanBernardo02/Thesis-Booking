import {
  DatabaseOutlined,
  ManOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { Card, Col, Modal, Row, Spin } from "antd";
import moment from "moment";
import React, { useRef, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {
  getAllDoctors,
  getAllPatients,
  getServices,
  getAllAppointments,
} from "../../api/api";
import ChildrenReport from "../Report/ChildrenReport";
import FemaleReport from "../Report/FemaleReport";
import MaleReport from "../Report/MaleReport";
import PrintAdminAppoinment from "../Report/PrintAdminAppoinment";
import SeniorReport from "../Report/SeniorReport";
import { BarChart, PieChart } from "react-chartkick";
import "chartkick/chart.js";
import "../.././index.css";

const Dashboard = () => {
  const [today, setToday] = useState(null);
  const [male, setMale] = useState(null);
  const [female, setFemale] = useState(null);
  const [senior, setSenior] = useState(null);
  const [children, setChildren] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const { confirm } = Modal;

  const { data } = useQuery({
    queryFn: getAllPatients,
    queryKey: ["patients"],
  });

  const { data: data1 } = useQuery({
    queryFn: getServices,
    queryKey: ["clinicServices"],
  });

  const { data: data2 } = useQuery({
    queryFn: getAllDoctors,
    queryKey: ["doctors"],
  });

  const { data: appointment, isLoading } = useQuery({
    queryFn: getAllAppointments,
    queryKey: ["appointments"],
  });

  const patient = data?.data?.patients;
  const service = data1?.data?.clinicServices;
  const doctor = data2?.data?.doctors;
  const appointments = appointment?.data?.appointments;

  const todays = new Date().toLocaleDateString();

  const currentDate = new Date(); // Get the current date

  // const todayAppointment = appointments?.filter(
  //   (appointment) => new Date(appointment.date).toLocaleDateString() === todays
  // );

  const todayAppointment = appointments?.filter(
    (appointment) =>
      new Date(appointment.date).toLocaleDateString() === todays &&
      appointment.status === "done"
  );

  const malePatient = patient?.filter((patient) => patient.gender === "male");

  console.log("male", malePatient);

  const femalePatient = patient?.filter(
    (patient) => patient.gender === "female"
  );

  const seniorPatient = patient?.filter((patient) => {
    const birthDate = new Date(patient.birthday);
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    return age >= 60;
  });

  const childrenPatient = patient?.filter((patient) => {
    const birthDate = new Date(patient.birthday);
    const ageInYears = currentDate.getFullYear() - birthDate.getFullYear();

    // Check if the age is between 0 and 12 years old
    return ageInYears >= 0 && ageInYears <= 12;
  });

  console.log("Appointments", appointments);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //children
  const childrenRef = useRef();
  const handleChildrenPrint = useReactToPrint({
    content: () => childrenRef.current,
  });

  const showConfirm = () => {
    confirm({
      title: "Do you want view and export data?",
      icon: <QuestionCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        handleChildrenPrint();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  //children
  const seniorRef = useRef();
  const handleSeniorPrint = useReactToPrint({
    content: () => seniorRef.current,
  });

  const showConfirm1 = () => {
    confirm({
      title: "Do you want view and export data?",
      icon: <QuestionCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        handleSeniorPrint();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const femaleRef = useRef();
  const handleFemalePrint = useReactToPrint({
    content: () => femaleRef.current,
  });

  const showConfirm2 = () => {
    confirm({
      title: "Do you want view and export data?",
      icon: <QuestionCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        handleFemalePrint();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const maleRef = useRef();
  const handleMalePrint = useReactToPrint({
    content: () => maleRef.current,
  });

  const showConfirm3 = () => {
    confirm({
      title: "Do you want view and export data?",
      icon: <QuestionCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        handleMalePrint();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome Administrator</h1>
      <div className="d-none">
        <div ref={componentRef}>
          <PrintAdminAppoinment appointmentToday={today} />
        </div>
      </div>
      <div className="d-none">
        <div ref={childrenRef}>
          <ChildrenReport children={children} />
        </div>
      </div>
      <div className="d-none">
        <div ref={seniorRef}>
          <SeniorReport senior={senior} />
        </div>
      </div>
      <div className="d-none">
        <div ref={maleRef}>
          <MaleReport male={male} />
        </div>
      </div>
      <div className="d-none">
        <div ref={femaleRef}>
          <FemaleReport female={female} />
        </div>
      </div>
      <Modal
        title="Export Today's Appointments"
        onCancel={() => {
          setShowPrintModal(false);
          setToday(null);
        }}
        open={showPrintModal}
        okText="Print"
        onOk={handlePrint}
      >
        <div className="d-flex flex-column p-5">
          {todayAppointment?.map((appointments) => (
            <>
              <p>
                <b>Appointment ID :</b> {appointments?._id}
              </p>
              <p>
                <b>Doctor Name :</b> {appointments?.doctorId?.firstname}{" "}
                {appointments.doctorId?.lastname}
              </p>
              <p>
                <b>Patient Name :</b> {appointments?.patientId?.firstname}{" "}
                {appointments.patientId?.lastname}
              </p>

              <p>
                <b>Date :</b> {moment(appointments.date).format("DD-MM-YYYY")}{" "}
              </p>
              <p>
                <b>Time :</b> {appointments.time}
              </p>
              <p>
                <b>Status :</b> {appointments.status}
              </p>
            </>
          ))}
        </div>
      </Modal>

      <Row gutter={16}>
        <Col span={6} xs={24} sm={12} md={8} lg={6}>
          <div style={{ width: "100%" }}>
            <div
              style={{
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                // display: "flex", // added display: flex
                alignItems: "center", // added align-items: center
                margin: "0 0 10px 0",
              }}
            >
              <div
                style={{
                  backgroundColor: "#242444",
                  width: "100%",
                  height: 180,
                  padding: "10px",
                  display: "flex", // added display: flex
                  alignItems: "center", // added align-items: center
                }}
              >
                <h5 style={{ color: "white", margin: 0 }}>NO. OF DOCTORS</h5>{" "}
                {/* removed default margin */}
                <UsergroupAddOutlined
                  style={{ fontSize: "60px", marginLeft: "20px" }}
                />{" "}
                {/* used margin-left instead of padding */}
                <h1 style={{ margin: 0, marginLeft: "10px", color: "white" }}>
                  {doctor?.length}
                </h1>{" "}
                {/* used margin-left instead of padding */}
              </div>
              <Link to="/admin/doctor-account">
                <div
                  style={{
                    color: "#04847c",
                    cursor: "pointer",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <b style={{ color: "#04847c" }}>VIEW</b>
                </div>
              </Link>
            </div>
          </div>
        </Col>
        <Col span={6} xs={24} sm={12} md={8} lg={6}>
          <div style={{ width: "100%" }}>
            <div
              style={{
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                // display: "flex", // added display: flex
                alignItems: "center", // added align-items: center
                margin: "0 0 10px 0",
              }}
            >
              <div
                style={{
                  backgroundColor: "#242444",
                  width: "100%",
                  height: 180,
                  padding: "10px",
                  display: "flex", // added display: flex
                  alignItems: "center", // added align-items: center
                }}
              >
                <h5 style={{ color: "white", margin: 0 }}>NO. OF PATIENT</h5>{" "}
                {/* removed default margin */}
                <UsergroupAddOutlined
                  style={{ fontSize: "60px", marginLeft: "20px" }}
                />{" "}
                {/* used margin-left instead of padding */}
                <h1 style={{ margin: 0, marginLeft: "10px", color: "white" }}>
                  {patient?.length}
                </h1>{" "}
                {/* used margin-left instead of padding */}
              </div>
              <Link to="/admin/userslist">
                <div
                  style={{
                    color: "#04847c",
                    cursor: "pointer",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <b style={{ color: "#04847c" }}>VIEW</b>
                </div>
              </Link>
            </div>
          </div>
        </Col>
        <Col span={6} xs={24} sm={12} md={8} lg={6}>
          <div style={{ width: "100%" }}>
            <div
              style={{
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                // display: "flex", // added display: flex
                alignItems: "center", // added align-items: center
                margin: "0 0 10px 0",
              }}
            >
              <div
                style={{
                  backgroundColor: "#242444",
                  width: "100%",
                  height: 180,
                  padding: "10px",
                  display: "flex", // added display: flex
                  alignItems: "center", // added align-items: center
                }}
              >
                <h5 style={{ color: "white", margin: 0 }}>NO. OF SERVICES</h5>{" "}
                {/* removed default margin */}
                <UsergroupAddOutlined
                  style={{ fontSize: "60px", marginLeft: "20px" }}
                />{" "}
                {/* used margin-left instead of padding */}
                <h1 style={{ margin: 0, marginLeft: "10px", color: "white" }}>
                  {service?.length}
                </h1>{" "}
                {/* used margin-left instead of padding */}
              </div>
              <Link to="/admin/clinic-service">
                <div
                  style={{
                    color: "#04847c",
                    cursor: "pointer",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <b style={{ color: "#04847c" }}>VIEW</b>
                </div>
              </Link>
            </div>
          </div>
        </Col>

        <Col span={6} xs={24} sm={12} md={8} lg={6}>
          <div style={{ width: "100%" }}>
            <div
              style={{
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                // display: "flex", // added display: flex
                alignItems: "center", // added align-items: center
                margin: "0 0 10px 0",
              }}
            >
              <div
                style={{
                  backgroundColor: "#242444",
                  width: "100%",
                  height: 180,
                  padding: "10px",
                  display: "flex", // added display: flex
                  alignItems: "center", // added align-items: center
                }}
              >
                <h5 style={{ color: "white", margin: 0 }}>
                  TODAY'S Appointment
                </h5>{" "}
                {/* removed default margin */}
                <UsergroupAddOutlined
                  style={{ fontSize: "60px", marginLeft: "20px" }}
                />{" "}
                {/* used margin-left instead of padding */}
                <h1 style={{ margin: 0, marginLeft: "10px", color: "white" }}>
                  {todayAppointment?.length}
                </h1>{" "}
                {/* used margin-left instead of padding */}
              </div>

              <div
                style={{
                  color: "#04847c",
                  cursor: "pointer",
                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  setToday(appointments);
                  setShowPrintModal(true);
                }}
              >
                <b style={{ color: "#04847c" }}>VIEW</b>
              </div>
            </div>
          </div>
        </Col>

        {/* new */}

        {/* <Col span={6}></Col> */}
      </Row>
      {/* new hahaha */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3 className="haha">Patient Demographics</h3>
        <BarChart
          data={[
            ["Female", femalePatient?.length],
            ["Male", malePatient?.length],
            ["Senior", seniorPatient?.length],
            ["Children", childrenPatient?.length],
          ]}
          className="custom-bar-chart"
        />
      </div>
    </div>
  );
};

export default Dashboard;
