import {
  ScheduleOutlined,
  QuestionCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Col, Row, Modal } from "antd";
import React, { useState, useRef } from "react";
import { useQuery } from "react-query";
import { getAllDoctorAppointments } from "../../api/api";
import { useReactToPrint } from "react-to-print";
import DoneReport from "../Report/DoneReport";
import PendingReport from "../Report/PendingReport";
import ApprovedReport from "../Report/ApprovedReport";
import { DatePicker } from "antd";
import CancelledReport from "../Report/CancelledReport";
const { RangePicker } = DatePicker;

const DashboardDoctor = ({ user }) => {
  const [selectedRange, setSelectedRange] = useState([]);
  const { data, isLoading } = useQuery({
    queryFn: getAllDoctorAppointments,
    queryKey: ["doctor-appointments"],
  });
  const [done, setDone] = useState(null);
  const [pending, setPending] = useState(null);
  const [approved, setApproved] = useState(null);
  const [cancelled, setCancelled] = useState(null);

  const { confirm } = Modal;

  const handleDateRangeChange = (dates) => {
    setSelectedRange(dates);
  };

  const todays = new Date().toLocaleDateString();

  const appointments = data?.data?.appointments;

  const todayAppointment = appointments?.filter(
    (appointment) =>
      new Date(appointment.date).toLocaleDateString() === todays &&
      appointment.status === "done"
  );

  // const pendingAppointment = appointments?.filter(
  //   (appointment) => appointment.status === "pending"
  // );

  const pendingAppointment = appointments?.filter(
    (appointment) =>
      selectedRange[0] <= new Date(appointment.date) &&
      new Date(appointment.date) <= selectedRange[1] &&
      appointment.status === "pending"
  );

  // const approvedAppointment = appointments?.filter(
  //   (appointment) => appointment.status === "approved"
  // );

  // const approvedAppointment = appointments?.filter(
  //   (appointment) => appointment.status === "approved"
  // );

  const approvedAppointment = appointments?.filter(
    (appointment) =>
      selectedRange[0] <= new Date(appointment.date) &&
      new Date(appointment.date) <= selectedRange[1] &&
      appointment.status === "approved"
  );

  const cancelledAppointment = appointments?.filter(
    (appointment) =>
      new Date(appointment.date).toLocaleDateString() === todays &&
      appointment.status === "cancelled"
  );

  console.log("kain", cancelledAppointment);

  const doneRef = useRef();
  const handleDonePrint = useReactToPrint({
    content: () => doneRef.current,
  });

  const showConfirm1 = () => {
    confirm({
      title: "Do you want view the Data?",
      icon: <QuestionCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        handleDonePrint();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const pendingRef = useRef();
  const handlePendingPrint = useReactToPrint({
    content: () => pendingRef.current,
  });

  const showConfirm2 = () => {
    confirm({
      title: "Do you want view the Data?",
      icon: <QuestionCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        handlePendingPrint();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const approvedRef = useRef();
  const handleApprovedPrint = useReactToPrint({
    content: () => approvedRef.current,
  });

  const showConfirm3 = () => {
    confirm({
      title: "Do you want view the Data?",
      icon: <QuestionCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        handleApprovedPrint();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const cancelledRef = useRef();
  const handleCancelledPrint = useReactToPrint({
    content: () => cancelledRef.current,
  });

  const showConfirm4 = () => {
    confirm({
      title: "Do you want view the Data?",
      icon: <QuestionCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        handleCancelledPrint();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Welcome Doctor, {user.firstname}</h2>
        <div style={{ textAlign: "right" }}>
          <RangePicker value={selectedRange} onChange={handleDateRangeChange} />
        </div>
      </div>
      <hr />

      <div className="d-none">
        <div ref={doneRef}>
          <DoneReport done={todayAppointment} />
        </div>
      </div>
      <div className="d-none">
        <div ref={pendingRef}>
          <PendingReport pending={pendingAppointment} />
        </div>
      </div>
      <div className="d-none">
        <div ref={approvedRef}>
          <ApprovedReport approved={approvedAppointment} />
        </div>
      </div>
      <div className="d-none">
        <div ref={cancelledRef}>
          <CancelledReport cancelled={cancelledAppointment} />
        </div>
      </div>
      <Row gutter={16}>
        <Col span={6} xs={24} sm={12} md={8} lg={6}>
          <div style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                // display: "flex",
                alignItems: "center",
                margin: "0 0 10px 0",
              }}
            >
              <div
                style={{
                  backgroundColor: "#242444",
                  width: "100%", // Set width to 100%
                  height: 180,
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h6 style={{ color: "white" }}>TODAY'S DONE APPOINTMENT</h6>
                <ScheduleOutlined
                  style={{ fontSize: "60px", marginLeft: "10px" }}
                />{" "}
                {/* Added margin-left */}
                <h4 style={{ margin: 0, marginLeft: "10px", color: "white" }}>
                  {todayAppointment?.length}
                </h4>{" "}
                {/* Added margin-left */}
              </div>
              <div
                style={{
                  color: "#04847c",
                  cursor: "pointer",
                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  setDone(appointments);
                  showConfirm1();
                }}
              >
                <b style={{ marginRight: "5px" }}>VIEW</b>
              </div>
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
                  backgroundColor: "#1D267D",
                  width: "100%",
                  height: 180,
                  padding: "10px",
                  display: "flex", // added display: flex
                  alignItems: "center", // added align-items: center
                }}
              >
                <h6 style={{ color: "white", margin: 0 }}>
                  PENDING APPOINTMENT
                </h6>{" "}
                {/* removed default margin */}
                <ScheduleOutlined
                  style={{ fontSize: "60px", marginLeft: "10px" }}
                />{" "}
                {/* used margin-left instead of padding */}
                <h4 style={{ margin: 0, marginLeft: "10px", color: "white" }}>
                  {pendingAppointment?.length}
                </h4>{" "}
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
                  setPending(appointments);
                  showConfirm2();
                }}
              >
                <b>VIEW</b>
              </div>
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
                  backgroundColor: "#5C469C",
                  width: "100%",
                  height: 180,
                  padding: "10px",
                  display: "flex", // added display: flex
                  alignItems: "center", // added align-items: center
                }}
              >
                <h6 style={{ color: "white", margin: 0 }}>
                  APPROVED APPOINTMENT
                </h6>{" "}
                {/* removed default margin */}
                <ScheduleOutlined
                  style={{ fontSize: "60px", marginLeft: "20px" }}
                />{" "}
                {/* used margin-left instead of padding */}
                <h4 style={{ margin: 0, marginLeft: "10px", color: "white" }}>
                  {approvedAppointment?.length}
                </h4>{" "}
                {/* used margin-left instead of padding */}
              </div>
              <div
                style={{
                  marginLeft: "3px",
                  color: "#04847c",
                  cursor: "pointer",
                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  setApproved(appointments);
                  showConfirm3();
                }}
              >
                <b>VIEW</b>
              </div>
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
                  backgroundColor: "#D4ADFC",
                  width: "100%",
                  height: 180,
                  padding: "10px",
                  display: "flex", // added display: flex
                  alignItems: "center", // added align-items: center
                }}
              >
                <h6 style={{ color: "white", margin: 0 }}>
                  TODAY'S CANCELLED APPOINTMENT
                </h6>{" "}
                {/* removed default margin */}
                <ScheduleOutlined
                  style={{ fontSize: "60px", marginLeft: "20px" }}
                />{" "}
                {/* used margin-left instead of padding */}
                <h4 style={{ margin: 0, marginLeft: "10px", color: "white" }}>
                  {cancelledAppointment?.length}
                </h4>{" "}
                {/* used margin-left instead of padding */}
              </div>
              <div
                style={{
                  marginLeft: "3px",
                  color: "#04847c",
                  cursor: "pointer",
                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  setCancelled(appointments);
                  showConfirm4();
                }}
              >
                <b>VIEW</b>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardDoctor;
