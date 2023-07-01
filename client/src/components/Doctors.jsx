import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import ".././index.css";
import { getUserProfile } from "../redux/userSlice";

const Doctors = ({ doctor }) => {
  const BASE_URL = "https://starwheal.onrender.com/api";

  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  const navigate = useNavigate();
  // const { user } = useSelector((state) => state.user);
  const user = useSelector(getUserProfile);

  const chatDoctor = (Id) => {
    // return;
    try {
      api.post("/chat/", {
        senderId: user._id,
        receiverId: Id,
      });
      navigate(`/chat`);
    } catch (error) {}
  };

  return (
    <div className="card p-2 cursor-pointer">
      <div className="doctor-chat">
        <h1 className="card-title">
          {doctor.firstname} {doctor.lastname}
        </h1>
        <MessageOutlined
          style={{ fontSize: "20px" }}
          onClick={() => chatDoctor(doctor._id)}
        />
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
      {/* <p>
        <b>Address : </b>
        {doctor.address}
      </p> */}

      <p>
        {/* <b>Hours Schedule : </b> */}
        {/* {doctor.timings[0]} - {doctor.timings[1]} */}
      </p>
      <Button
        onClick={() => navigate(`/book-appointment/${doctor._id}`)}
        style={{ color: "white", backgroundColor: "#013737" }}
      >
        Book
      </Button>
    </div>
  );
};

export default Doctors;
