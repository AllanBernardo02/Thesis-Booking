import {
  Button,
  Table,
  Modal,
  Calendar,
  Space,
  Popconfirm,
  message,
  Input,
} from "antd";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { Toaster, toast } from "react-hot-toast";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  approveAppointment,
  cancelAppointment,
  cancelAppointmentDoctor,
  doneAppointment,
  getAllDoctorAppointments,
} from "../api/api";
import { Typography } from "@mui/material";
import PrintAppointment from "./Report/PrintAppointment";
import { EyeFilled, EyeInvisibleOutlined } from "@ant-design/icons";
import { getUserProfile } from "../redux/userSlice";
import smc from "../asset/smc.png";

const DoctorAppointmentList = () => {
  const [table, setTable] = useState(false);
  const [datas, setData] = useState();
  const [searchedText, setSearchedText] = useState(""); // search
  // const [totalPages, setTotalPages] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector(getUserProfile);

  const { data, isLoading } = useQuery({
    queryFn: getAllDoctorAppointments,
    queryKey: ["doctor-appointments"],
  });

  const [today, setToday] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const appointments = data?.data?.appointments;

  const todayPoint = new Date().toLocaleDateString();

  const todayAppointment = appointments?.filter(
    (appointment) =>
      new Date(appointment.date).toLocaleDateString() === todayPoint &&
      appointment.status === "done"
  );

  console.log("sameid", appointments);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pagination = {
    pageSize: pageSize,
    total: appointments?.length,
    current: currentPage,
    onChange: handlePageChange,
    showSizeChanger: false,
    // showTotal: (total, range) =>
    //   `${range[0] + 1}-${range[1]} of ${total} items`,
    // itemRender: (page, type, originalElement) => {
    //   if (type === "prev") {
    //     return <a>Previous</a>;
    //   }
    //   if (type === "next") {
    //     return <a>Next</a>;
    //   }
    //   return originalElement;
    // },
    hideOnSinglePage: true,
  };
  // const pageSize = 7; // Number of items per page
  // const totalPages = Math.ceil(appointments?.length / pageSize);

  // console.log("Appointment", appointments);
  // console.log("Today", today);

  const cancelMutation = useMutation({
    mutationFn: cancelAppointmentDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctor-appointments"]);
      toast.success("Succesfully Cancelled the appointment", {
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

  const isMobile = useMediaQuery({ query: "(max-width: 1172px)" });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1171px)" });

  const divStyle = {
    opacity: table ? 1 : 0,
    transition: table ? "opacity 4s ease-in-out 3s" : "none",
  };

  const logicTable = (record) => {
    setData(record);
    setTable(!table);
  };

  const approveMutation = useMutation({
    mutationFn: approveAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctor-appointments"]);
      queryClient.invalidateQueries(["doctor-patients"]);
      toast.success("Succesfully approved the appointment", {
        duration: 2000,
      });
    },
  });

  const doneMutation = useMutation({
    mutationFn: doneAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctor-appointments"]);
      toast.success("Succesfully finish the appointment", {
        duration: 2000,
      });
    },
  });

  const handleCancel = (id) => {
    cancelMutation.mutate({
      appointmentId: id,
    });
  };

  const handleApprove = (id, id2) => {
    approveMutation.mutate({
      appointmentId: id,
      patientId: id2,
      doctorFirstName: user.firstname,
      doctorLastName: user.lastname,
    });
  };

  const handleDone = (id) => {
    doneMutation.mutate({ appointmentId: id });
  };

  const confirm = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  const columns = [
    {
      title: "Appointment ID",
      // dataIndex: "_id",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Patient Name",
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record?.patientId?.firstname)
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          String(record.middlename)
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          String(record?.patientId?.lastname)
            ?.toLowerCase()
            ?.includes(value.toLowerCase())
        );
      },
      render: (text, record) =>
        `${record?.patientId?.firstname} ${record?.patientId?.lastname}`,
    },
    {
      title: "Service",
      dataIndex: "clinicService",
    },
    {
      title: "Date",
      render: (text, record) => record.date.split("T")[0],
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Status",
      // filteredValue: [searchedText],
      // onFilter: (value, record) => {
      //   return String(record.status)
      //     ?.toLowerCase()
      //     ?.includes(value.toLowerCase());
      // },
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
            {record.status === "pending" && (
              <>
                <Button
                  success
                  onClick={() =>
                    handleApprove(record._id, record.patientId._id)
                  }
                >
                  Approve
                </Button>
              </>
            )}
            {record.status === "cancelled" && (
              <>
                <Typography>Cancelled</Typography>
              </>
            )}
            {record.status === "done" && (
              <>
                <Typography>Done</Typography>
              </>
            )}
            {!["done", "cancelled"].includes(record.status) && (
              <>
                <Popconfirm
                  title="Are you sure to Cancel this Appointment?"
                  placement="leftTop"
                  description="Are you sure to Cancel this Appointment?"
                  onConfirm={() => handleCancel(record._id)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>
                    {/* {record.status === "pending" ? "Reject" : "Cancel"} */}
                    Cancel
                  </Button>
                </Popconfirm>
              </>
            )}
            {record.status === "approved" && (
              <Button type="primary" onClick={() => handleDone(record._id)}>
                Done
              </Button>
            )}
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
                  <b>Doctor Name:</b> {datas?.patientId?.firstname}{" "}
                  {datas?.patientId?.lastname}
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
                    {record.status === "pending" && (
                      <>
                        <Button
                          success
                          onClick={() => handleApprove(record._id)}
                        >
                          Approve
                        </Button>
                      </>
                    )}
                    {record.status === "cancelled" && (
                      <>
                        <Typography>Cancelled</Typography>
                      </>
                    )}
                    {record.status === "done" && (
                      <>
                        <Typography>Done</Typography>
                      </>
                    )}
                    {!["done", "cancelled"].includes(record.status) && (
                      <>
                        <Button danger onClick={() => handleCancel(record._id)}>
                          {record.status === "pending" ? "Reject" : "Cancel"}
                        </Button>
                      </>
                    )}
                    {record.status === "approved" && (
                      <Button
                        type="primary"
                        onClick={() => handleDone(record._id)}
                      >
                        Done
                      </Button>
                    )}
                  </Space>
                </div>
              </>
            ) : (
              <>
                <p>
                  {record.patientId.firstname} {record.patientId.lastname}
                </p>
              </>
            )}
          </div>
        ) : (
          `${record.patientId.firstname} ${record.patientId.lastname}`
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
      <Layout>
        <div className="d-none">
          <div ref={componentRef}>
            <PrintAppointment appointmentToday={today} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {" "}
          <h1 className="page-header">My Appointments</h1>
          <Button
            onClick={() => {
              setToday(appointments);
              setShowPrintModal(true);
            }}
            style={{ color: "white", backgroundColor: "#013737" }}
          >
            Print
          </Button>
        </div>
        <h4>Total : {appointments.length}</h4>
        {/* <Table
          columns={columns}
          dataSource={appointments}
          pagination={{
            pageSize: 6,
            total: 1,
          }}
        /> */}

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
            dataSource={appointments}
            pagination={{
              pageSize: pageSize,
              total: appointments?.length,
            }}
          />
        )}
        {!isMobile && (
          <Table
            columns={columns}
            dataSource={appointments}
            pagination={pagination}
          />
        )}

        <Modal
          title="Print Report"
          onCancel={() => {
            setShowPrintModal(false);
            setToday(null);
          }}
          open={showPrintModal}
          okText="Print"
          onOk={handlePrint}
        >
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            <div className="d-flex justify-content-between m-3">
              <div>
                {" "}
                <img width="100px" src={smc} alt="" />
              </div>
              <div className="text-center">
                <h6 className="mb-0">STARWHEAL MEDICAL CLINIC</h6>
                <h6 className="mb-0">APPOINTMENT DETAILS</h6>
                <h6>AGUINALDO, SAN ANTONIO, PARANAQUE, 1700 METRO MANILA</h6>
              </div>
              <div>
                <img width="100px" src={smc} alt="" />
              </div>
            </div>

            <div className="m-4">
              <h4>List of Today Appointment</h4>
              <table class="table table-striped">
                <tr style={{ backgroundColor: "#013737", color: "white" }}>
                  <th>APPOINTMENT ID</th>
                  <th>FULL NAME</th>
                  <th>SERVICE</th>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>STATUS</th>
                </tr>
                <tbody>
                  {todayAppointment?.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment._id}</td>
                      <td>
                        {appointment?.patientId?.firstname}{" "}
                        {appointment?.patientId?.lastname}
                      </td>
                      <td>{appointment.clinicService}</td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
        {/* {showPrintModal && (
          <Modal
            title="Print Ticket"
            onCancel={() => {}}
            visible={showPrintModal}
            okText="Print"
            onOk={handlePrint}
          >
            <div className="d-flex flex-column p-5" ref={componentRef}>
              <p>Appointment ID : {selectedBooking._id}</p>
              <p>
                Doctor Name : {selectedBooking.doctorInfo.firstName}{' '}
                {selectedBooking.doctorInfo.lastName}
              </p>
              <p>
                Date & Time :{' '}
                {moment(selectedBooking.date).format('DD-MM-YYYY')}{' '}
                {moment(selectedBooking.time).format('hh:mm a')}
              </p>
              <p>Status : {selectedBooking.status}</p>
            </div>
          </Modal> */}
        {/* )} */}
        <Toaster />
        {/* <Calendar onPanelChange={onPanelChange} /> */}
      </Layout>
    </React.Fragment>
  );
};

export default DoctorAppointmentList;
