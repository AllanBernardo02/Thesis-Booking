import React, { useState, useEffect } from "react";
import {
  Calendar,
  Badge,
  Modal,
  Form,
  Radio,
  Space,
  Select,
  message,
  Row,
  Col,
  Button,
} from "antd";
import Layout from "../components/Layout";
import moment from "moment";
import { useMutation, useQuery } from "react-query";
import { bookAppointment, getDoctorSchedule } from "../api/api";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { Toaster, toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getUserProfile } from "../redux/userSlice";

const BookAppointment = () => {
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalValidation, setModalValidation] = useState(false);
  const [selectedSched, setSelectedSched] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [services, setServices] = useState([]);
  const [time, setTime] = useState(null);
  const [occoupied, setOccoupied] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { doctorId } = useParams();
  const user = useSelector(getUserProfile);
  const params = useParams();

  // console.log("User moto", user);
  // console.log("Params moto", params);

  const bookMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      toast.success(
        "Successfully book a reservation, wait until the doctor confirms."
      );
      setIsModalOpen(false);
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        // content: "Booking failed, you currently have pending booking",
        content: error.response.data.message || "Booking failed",
      });
      setSelectedDate("");
      setSelectedService("");
      setTime(null);
      setIsModalOpen(false);
    },
  });

  const handleBook = () => {
    bookMutation.mutate({
      doctorId,
      date: selectedDate,
      time,
      clinicService: selectedService,
      patientFirstName: user.firstname,
      patientLastName: user.lastname,
    });
    setModalValidation(false);
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setTime(e.target.value);
  };

  const { data, isLoading } = useQuery({
    queryFn: () => getDoctorSchedule({ id: doctorId }),
    queryKey: ["doctor-schedule"],
  });

  useEffect(() => {
    if (data) {
      setSchedules(data.data.schedules);
      const services = data.data.clinicServices.map((service) => ({
        value: service.name,
        label: service.name,
      }));
      setServices(services);
    }
  }, [data, schedules]);

  const onPanelChange = (value) => {
    const selectedMonth = value.month();
    const schedulesInMonth = schedules.filter((scheds) => {
      const schedMonth = moment(scheds.date).month();
      return schedMonth === selectedMonth;
    });
    setSchedules(schedulesInMonth);
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const schedList = schedules.filter(
      (sched) => sched.date.split("T")[0] === formattedDate
    );

    const isBeforeToday = value.isBefore(moment().startOf("day"));

    return (
      <div
        onClick={() => {
          setSelectedSched(schedList[0].time);
          setSelectedDate(schedList[0].date);
          setOccoupied(schedList[0].occoupied);

          showModal();
        }}
        style={{ height: "100%" }}
      >
        {isBeforeToday
          ? null
          : schedList.map((schedule, index) => {
              const time = schedule.time;

              return time.map((t) => {
                const isAvailable = !occoupied.includes(t);

                return (
                  <li key={index}>
                    <Badge status="default" text={t} />
                    {/* <Badge
                      status={isAvailable ? "success" : "error"}
                      text={t}
                    /> */}
                  </li>
                );
              });
            })}
      </div>
    );
  };

  const handleBookValidation = () => {
    setModalValidation(true);
  };

  const handleCancelValidation = () => {
    setModalValidation(false);
  };

  if (isLoading) {
    return <h5>Loading...</h5>;
  }

  console.log(selectedSched, "<  selecteed sched");

  return (
    <Layout>
      {contextHolder}
      {/* <Row>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Calendar
            onPanelChange={onPanelChange}
            dateCellRender={dateCellRender}
          />
        </Col>
      </Row> */}
      <Calendar onPanelChange={onPanelChange} dateCellRender={dateCellRender} />
      <Modal
        title="Booking Confirmation"
        onOk={handleBook}
        open={modalValidation}
        destroyOnClose={true}
        onCancel={handleCancelValidation}
        footer={[
          <Button
            key="book"
            // type="primary"

            onClick={handleBook}
            disabled={
              !selectedDate ||
              !selectedService ||
              !time ||
              user._id === params.doctorId
            }
            style={{ backgroundColor: "rgba(0, 86, 86, 1)", color: "white" }}
          >
            PROCEED
          </Button>,
          <Button
            key="cancel"
            onClick={handleCancelValidation}
            style={{ color: "rgba(0, 86, 86, 1)" }}
          >
            CANCEL
          </Button>,
        ]}
      >
        <Typography fontWeight="bold" variant="h6">
          Dr. {data.data.firstname} {data.data.lastname}
        </Typography>
        <Typography fontSize={15}>{data.data.specialization}</Typography>
        <hr />
        <Typography>Time: {time}</Typography>
        <Typography>
          Date: {selectedDate && new Date(selectedDate).toLocaleDateString()}
        </Typography>
        <Typography>Service: {selectedService}</Typography>
      </Modal>

      <Modal
        title="Add Appointment"
        open={isModalOpen}
        // onOk={handleBook}
        onCancel={handleCancel}
        width={500}
        destroyOnClose={true}
        okButtonProps={{
          disabled: !selectedDate || !selectedService || !time,
        }}
        okText="Book Appointment"
        bodyStyle={{ maxHeight: "400px", overflowY: "scroll" }}
        footer={[
          <Button
            key="book"
            // type="primary"
            // onClick={handleBook}
            onClick={handleBookValidation}
            style={{
              backgroundColor: "rgba(0, 86, 86, 1)",
              color: "white",
              display: user._id === params.doctorId ? "none" : "",
            }}
          >
            BOOK
          </Button>,
          <Button
            key="cancel"
            onClick={handleCancel}
            style={{ color: "rgba(0, 86, 86, 1)" }}
          >
            GO BACK
          </Button>,
        ]}
      >
        <Typography fontWeight="bold" variant="h6">
          Dr. {data.data.firstname} {data.data.lastname}
        </Typography>
        <Typography fontSize={15}>{data.data.specialization}</Typography>

        <Box>
          <Typography mt={2} fontSize={17} fontWeight="bold">
            Service
          </Typography>
          <Select
            style={{ width: 200 }}
            onChange={(val) => {
              setSelectedService(val);
              console.log(time, " << time");
            }}
            options={services}
          />
        </Box>

        <Radio.Group onChange={onChange} value={time}>
          <Typography fontWeight="bold" mb={1} mt={3}>
            Time
          </Typography>
          <Box
            display="flex"
            sx={{ justifyContent: "space-around", margin: "auto" }}
          >
            <Box>
              <Typography mb={2}>AM</Typography>
              <Box display="flex" flexDirection="column">
                {selectedSched.map((sched, i) => {
                  if (sched.includes("am")) {
                    return (
                      <Radio disabled={occoupied.includes(sched)} value={sched}>
                        {sched}
                      </Radio>
                    );
                  }
                })}
              </Box>
            </Box>
            <Box ml={3}>
              <Typography mb={2}>PM</Typography>
              <Box display="flex" flexDirection="column">
                {selectedSched.map((sched, i) => {
                  if (sched.includes("pm")) {
                    return (
                      <Space key={sched} style={{ marginBottom: 5 }}>
                        <Radio
                          disabled={occoupied.includes(sched)}
                          value={sched}
                        >
                          {sched}
                        </Radio>
                      </Space>
                    );
                  }
                })}
              </Box>
            </Box>
          </Box>
        </Radio.Group>
      </Modal>
      <Toaster />
    </Layout>
  );
};

export default BookAppointment;
