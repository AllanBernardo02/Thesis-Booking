import React, { useEffect, useState } from "react";
import PatientForm from "../../components/PatientForm";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { getUserProfile } from "../../redux/userSlice";
import { toast } from "react-hot-toast";

const PatientProfileUpdate = () => {
  // const BASE_URL = "http://localhost:5000/api";
  const BASE_URL = "https://starwheal.onrender.com/api";

  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  const [patient, setPatient] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(getUserProfile);

  console.log("PatientProfile", patient);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await api.post(
        "/user/update-patient-profile",
        {
          ...values,
          userId: user._id,
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
        // navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
    console.log("Success Doctor:", values);
  };

  const getPatientData = async () => {
    try {
      dispatch(showLoading());
      const response = await api.post(
        "/user/get-user-info-by-user-id",
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
        setPatient(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getPatientData();
  }, []);

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-title">Patient Profile</h1>
        <hr />
        {patient && (
          <PatientForm onFinish={onFinish} initivalValues={patient} />
        )}
      </Layout>
    </React.Fragment>
  );
};

export default PatientProfileUpdate;
