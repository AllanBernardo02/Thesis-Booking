import React, { useEffect, useState } from "react";
import DoctorForm from "../../components/DoctorForm";
import Layout from "../../components/Layout";

import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { getUserProfile } from "../../redux/userSlice";

const Profile = () => {
  // const BASE_URL = "http://localhost:5000/api";
  const BASE_URL = "https://starwheal.onrender.com/api";

  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.user);
  const user = useSelector(getUserProfile);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await api.post(
        "/doctor/update-doctor-profile",
        {
          ...values,
          userId: user._id,
          // timings: [
          //   moment(values.timings[0]).format("hh:mm a"),
          //   moment(values.timings[1]).format("hh:mm a"),
          // ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
    console.log("Success Doctor:", values);
  };

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await api.post(
        "/doctor/get-doctor-info-by-user-id",
        {
          userId: params.userId,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-title">My Profile</h1>
        <hr />
        {doctor && <DoctorForm onFinish={onFinish} initivalValues={doctor} />}
      </Layout>
    </React.Fragment>
  );
};

export default Profile;
