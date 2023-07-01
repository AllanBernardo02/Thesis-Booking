import { ScheduleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorOwn = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <div
      className="card p-2 cursor-pointer"
      style={{ backgroundColor: "#87CBB9" }}
    >
      <div className="doctor-chat">
        <h1 className="card-title">
          {/* {doctor.firstname} {doctor.lastname} */}
          My Schedule
          <ScheduleOutlined style={{ fontSize: "60px", marginLeft: "20px" }} />
        </h1>
      </div>
      <hr />
      <p>
        <b>Specialization : </b>
        {doctor.specialization}
      </p>
      <p>
        <b>Experience : </b>
        {doctor.experience}
      </p>
      <p>
        <b>Consultation Fee : </b>
        {doctor.feeConsultation}
      </p>
      <p>
        <b>Phone Number : </b>
        {doctor.phoneNumber}
      </p>

      <p>
        {/* <b>Hours Schedule : </b> */}
        {/* {doctor.timings[0]} - {doctor.timings[1]} */}
      </p>
      <Button
        onClick={() => navigate(`/book-appointment/${doctor._id}`)}
        style={{ color: "white", backgroundColor: "#013737" }}
      >
        View
      </Button>
    </div>
  );
};

export default DoctorOwn;
