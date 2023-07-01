import { Button, Table, Modal, Calendar, Space } from "antd";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { Toaster, toast } from "react-hot-toast";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  cancelAppointment,
  getAllUserAppointments,
  getDoctorSchedule,
} from "../api/api";
import { Typography } from "@mui/material";
import PrintDetails from "./Report/PrintDetails";
import { EyeFilled, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const PatientAppointments = () => {
  const [table, setTable] = useState(false);
  const [datas, setData] = useState();
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: "(max-width: 1172px)" });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1171px)" });

  console.log("Print", selectedBooking);

  const { data, isLoading } = useQuery({
    queryFn: getAllUserAppointments,
    queryKey: ["user-appointments"],
  });

  // const { data1, isLoading1 } = useQuery({
  //   queryFn: getDoctorSchedule,
  //   queryKey: ["doctor-schedule"],
  // });

  const appointments = data?.data?.appointments;
  // const doctorSched = data1?.data?.schedules;

  // console.log("Sched", doctorSched);

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["user-appointments"]);
      toast.success("Succesfully cancelled the appointment", {
        duration: 2000,
      });
    },
    onError: ({ response }) => {
      const message = response.data.message;
      if (message === "24_ERR") {
        toast.error("Can't cancel appointment if its less than 24 hours", {
          duration: 3000,
        });
      }
    },
  });

  const divStyle = {
    opacity: table ? 1 : 0,
    transition: table ? "opacity 4s ease-in-out 3s" : "none",
  };

  const handleCancel = (id) => {
    cancelMutation.mutate({ appointmentId: id });
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  const logicTable = (record) => {
    setData(record);
    setTable(!table);
  };

  // useEffect(() => {
  //   getAppointmentsData();
  // }, []);

  const handleView = (record) => {
    navigate(`/book-appointment/${record.doctorId._id}`);
  };

  const columns = [
    {
      // title: "Appointment ID",
      title: "#",
      // dataIndex: "_id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Doctor Name",
      render: (text, record) =>
        `${record.doctorId.firstname} ${record.doctorId.lastname}`,
    },
    {
      title: "Service",
      dataIndex: "clinicService",
    },
    {
      title: "Date",
      render: (text, record) => `${record.date.split("T")[0]}`,
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Status",
      render: (text, record) => (
        <span style={{ textTransform: "capitalize" }}>{record.status}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <Space>
            {record.status === "approved" && (
              <>
                <Button
                  className="text-md underline"
                  onClick={() => {
                    setSelectedBooking(record);
                    setShowPrintModal(true);
                  }}
                >
                  Print Details
                </Button>
              </>
            )}
            {record.status === "cancelled" && (
              <Typography>Cancelled</Typography>
            )}
            {!["done", "cancelled"].includes(record.status) && (
              <>
                <Button danger onClick={() => handleCancel(record._id)}>
                  Cancel
                </Button>
                {/* <Button onClick={() => handleView(record)}>View</Button> */}
              </>
            )}
            {record.status === "done" && <Typography>Done</Typography>}
          </Space>
        </div>
      ),
    },
  ];

  const columns1 = [
    {
      title: "Doctor Name",
      render: (_, record) =>
        table === true ? (
          <div style={divStyle}>
            {" "}
            {datas._id === record._id ? (
              <>
                <h6>
                  <b>Appointment ID:</b> {datas._id}
                </h6>
                <h6>
                  <b>Doctor Name:</b> {datas.doctorId.firstname}{" "}
                  {datas.doctorId.lastname}
                </h6>
                <p>
                  <b>Service:</b> {datas.clinicService}
                </p>
                <p>
                  <b>Date:</b> {datas.date.split("T")[0]}
                </p>
                <p>
                  <b>Time:</b> {datas.time}
                </p>
                <p>
                  <b>Status:</b> {datas.status}
                </p>

                <div>
                  <Space>
                    {record.status === "approved" && (
                      <>
                        <Button
                          className="text-md underline"
                          onClick={() => {
                            setSelectedBooking(record);
                            setShowPrintModal(true);
                          }}
                        >
                          Print Details
                        </Button>
                      </>
                    )}
                    {record.status === "cancelled" && (
                      <Typography>Cancelled</Typography>
                    )}
                    {!["done", "cancelled"].includes(record.status) && (
                      <Button danger onClick={() => handleCancel(record._id)}>
                        Cancel
                      </Button>
                    )}
                    {record.status === "done" && <Typography>Done</Typography>}
                  </Space>
                </div>
              </>
            ) : (
              <>
                <p>
                  {record.doctorId.firstname} {record.doctorId.lastname}
                </p>
              </>
            )}
          </div>
        ) : (
          `${record.doctorId.firstname} ${record.doctorId.lastname}`
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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <React.Fragment>
      <div className="d-none">
        <div ref={componentRef}>
          <PrintDetails selectedBooking={selectedBooking} />
        </div>
      </div>
      <Layout>
        <h1 className="page-header">Appointments List</h1>
        {/* <h4>Number of Appointments : {appointments.length}</h4> */}
        {/* <Table
          columns={columns}
          dataSource={appointments}
          pagination={{
            pageSize: 6,
            total: totalPages,
          }}
        /> */}
        {!isBigScreen && (
          <Table
            columns={columns1}
            dataSource={appointments}
            pagination={{
              pageSize: 7,
              total: appointments?.length,
            }}
          />
        )}
        {!isMobile && (
          <Table
            columns={columns}
            dataSource={appointments}
            pagination={{
              pageSize: 7,
              total: appointments?.length,
            }}
          />
        )}

        {showPrintModal && (
          <Modal
            title="Print Ticket"
            onCancel={() => {
              setShowPrintModal(false);
              setSelectedBooking(null);
            }}
            open={showPrintModal}
            okText="Print"
            onOk={handlePrint}
          >
            <div className="d-flex flex-column p-5">
              <p>
                <b>Appointment ID :</b> {selectedBooking._id}
              </p>
              <p>
                <b>Doctor Name :</b> {selectedBooking.doctorId?.firstname}{" "}
                {selectedBooking.doctorId?.lastname}
              </p>
              {/* <p>
                Date & Time :{" "}
                {moment(selectedBooking.date).format("DD-MM-YYYY")}{" "}
                {moment(selectedBooking.time).format("hh:mm a")}
              </p> */}
              <p>
                <b>Date :</b>{" "}
                {moment(selectedBooking.date).format("DD-MM-YYYY")}{" "}
              </p>
              <p>
                <b>Time :</b> {selectedBooking.time}
              </p>
              <p>
                <b>Status :</b> {selectedBooking.status}
              </p>
            </div>
          </Modal>
        )}
        <Toaster />
        {/* <Calendar onPanelChange={onPanelChange} /> */}
      </Layout>
    </React.Fragment>
  );
};

export default PatientAppointments;
