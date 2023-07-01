import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctors from "../components/Doctors";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useQuery } from "react-query";
import { getAllActiveDoctors } from "../api/api";
import { Typography } from "@mui/material";
import Dashboard from "./Admin/Dashboard";
import { getUserProfile } from "../redux/userSlice";
import DashboardDoctor from "./Doctor/DashboardDoctor";
import DoctorOwn from "../components/DoctorOwn";

const Homepage = () => {
  const user = useSelector(getUserProfile);
  const { data, isLoading } = useQuery({
    queryFn: getAllActiveDoctors,
    queryKey: ["all-active-doctors"],
    onSuccess: () => {},
  });

  const doctors = data?.data?.doctors;
  let DOCTORS = [];

  if (!isLoading) {
    DOCTORS = doctors;
    console.log(DOCTORS);
  }

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    // <React.Fragment>
    //   <Layout>
    //     {!DOCTORS.length && (
    //       <Typography variant="h5" fontWeight="bold" mt={4} textAlign="center">
    //         Currently doesn't have active doctors
    //       </Typography>
    //     )}
    //     {DOCTORS.length > 0 && (
    //       <Row gutter={20}>
    //         {DOCTORS.length &&
    //           DOCTORS.map((doc, i) => (
    //             <Col span={8} xs={24} sm={24} lg={8} key={i}>
    //               <Doctors doctor={doc} />
    //             </Col>
    //           ))}
    //       </Row>
    //     )}
    //   </Layout>
    // </React.Fragment>
    <React.Fragment>
      <Layout>
        {user.userType === "admin" ? (
          <Dashboard />
        ) : user.userType === "doctor" ? (
          <>
            <DashboardDoctor user={user} />

            <DoctorOwn doctor={user} />
          </>
        ) : (
          <>
            {!DOCTORS.length && (
              <Typography
                variant="h5"
                fontWeight="bold"
                mt={4}
                textAlign="center"
              >
                Currently doesn't have active doctors
              </Typography>
            )}
            {DOCTORS.length > 0 && (
              <Row gutter={20}>
                {DOCTORS.length &&
                  DOCTORS.map((doc, i) => (
                    <Col span={8} xs={24} sm={24} lg={8} key={i}>
                      <Doctors doctor={doc} />
                    </Col>
                  ))}
              </Row>
            )}
          </>
        )}
      </Layout>
    </React.Fragment>
  );
};

export default Homepage;
