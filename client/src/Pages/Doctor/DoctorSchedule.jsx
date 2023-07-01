import { Checkbox, Collapse, DatePicker, Form } from "antd";
import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import toast, { Toaster } from "react-hot-toast";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useForm } from "antd/lib/form/Form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addDoctorSchedule, getDoctorSchedule } from "../../api/api";
import moment from "moment";
const DoctorSchedule = () => {
  const { Panel } = Collapse;

  const [date, setDate] = useState("");
  const [time, setTime] = useState([]);
  const [form] = useForm();
  const queryClient = useQueryClient();

  const onDateChange = (_, dateString) => {
    setDate(dateString);
  };

  const onTimeChange = (e) => {
    const isChecked = e.target.checked;
    const name = e.target.name;

    if (isChecked) {
      setTime((prevTime) => [...prevTime, name]);
    } else {
      setTime((prevTime) => prevTime.filter((time) => time !== name));
    }
  };

  const mutation = useMutation({
    mutationFn: addDoctorSchedule,
    onSuccess: () => {
      form.resetFields();
      queryClient.invalidateQueries(["doctor-schedule"]);
      toast.success("Schedule added");
    },
    onError: () => {
      toast.error("Error while adding schedule");
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ date, time });
    setTime([]);
  };

  function disabledDate(current) {
    // Disable dates before today's date
    return current && current < moment().endOf("day");
  }

  return (
    <Layout>
      <h1>My Schedule</h1>
      <hr />
      <Typography mb={1} variant="h5">
        Set Date
      </Typography>

      <DatePicker onChange={onDateChange} disabledDate={disabledDate} />

      <Typography mt={4} variant="h5">
        Set Time
      </Typography>
      <Form form={form} onFinish={handleSubmit}>
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="AM" key="1">
            <Box
              sx={{
                margin: "10px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridGap: "10px",
              }}
            >
              <Form.Item name="9:00 - 9:20 am">
                <Checkbox name="9:00 - 9:20 am" onChange={onTimeChange}>
                  9:00 - 9:20 am
                </Checkbox>
              </Form.Item>
              <Form.Item name="9:20 - 9:40 am">
                <Checkbox name="9:20 - 9:40 am" onChange={onTimeChange}>
                  9:20 - 9:40 am
                </Checkbox>
              </Form.Item>
              <Form.Item name="9:40 - 10:00 am">
                <Checkbox name="9:40 - 10:00 am" onChange={onTimeChange}>
                  9:40 - 10:00 am
                </Checkbox>
              </Form.Item>
              <Form.Item name="10:00 - 10:20 am">
                <Checkbox name="10:00 - 10:20 am" onChange={onTimeChange}>
                  10:00 - 10:20 am
                </Checkbox>
              </Form.Item>
              <Form.Item name="10:20 - 10:40 am">
                <Checkbox name="10:20 - 10:40 am" onChange={onTimeChange}>
                  10:20 - 10:40 am
                </Checkbox>
              </Form.Item>
              <Form.Item name="10:40 - 11:00 am">
                <Checkbox name="10:40 - 11:00 am" onChange={onTimeChange}>
                  10:40 - 11:00 am
                </Checkbox>
              </Form.Item>
              <Form.Item name="11:00 - 11:20 am">
                <Checkbox name="11:00 - 11:20 am" onChange={onTimeChange}>
                  11:00 - 11:20 am
                </Checkbox>
              </Form.Item>
              <Form.Item name="11:20 - 11:40 am">
                <Checkbox name="11:20 - 11:40 am" onChange={onTimeChange}>
                  11:20 - 11:40 am
                </Checkbox>
              </Form.Item>
              <Form.Item name="11:40 - 12:00 pm">
                <Checkbox name="11:40 - 12:00 pm" onChange={onTimeChange}>
                  11:40 - 12:00 pm
                </Checkbox>
              </Form.Item>
            </Box>
          </Panel>
          <Panel header="PM" key="2">
            <Box
              sx={{
                margin: "10px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridGap: "10px",
              }}
            >
              <Form.Item name="1:00 - 1:20 pm">
                <Checkbox name="1:00 - 1:20 pm" onChange={onTimeChange}>
                  1:00 - 1:20 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="1:20 - 1:40 pm">
                <Checkbox name="1:20 - 1:40 pm" onChange={onTimeChange}>
                  1:20 - 1:40 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="1:40 - 2:00 pm">
                <Checkbox name="1:40 - 2:00 pm" onChange={onTimeChange}>
                  1:40 - 2:00 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="2:00 - 2:20 pm">
                <Checkbox name="2:00 - 2:20 pm" onChange={onTimeChange}>
                  2:00 - 2:20 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="2:20 - 2:40 pm">
                <Checkbox name="2:20 - 2:40 pm" onChange={onTimeChange}>
                  2:20 - 2:40 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="2:40 - 3:00 pm">
                <Checkbox name="2:40 - 3:00 pm" onChange={onTimeChange}>
                  2:40 - 3:00 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="3:00 - 3:20 pm">
                <Checkbox name="3:00 - 3:20 pm" onChange={onTimeChange}>
                  3:00 - 3:20 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="3:20 - 3:40 pm">
                <Checkbox name="3:20 - 3:40 pm" onChange={onTimeChange}>
                  3:20 - 3:40 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="3:40 - 4:00 pm">
                <Checkbox name="3:40 - 4:00 pm" onChange={onTimeChange}>
                  3:40 - 4:00 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="4:00 - 4:20 pm">
                <Checkbox name="4:00 - 4:20 pm" onChange={onTimeChange}>
                  4:00 - 4:20 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="4:20 - 4:40 pm">
                <Checkbox name="4:20 - 4:40 pm" onChange={onTimeChange}>
                  4:20 - 4:40 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="4:40 - 5:00 pm">
                <Checkbox name="4:40 - 5:00 pm" onChange={onTimeChange}>
                  4:40 - 5:00 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="5:00 - 5:20 pm">
                <Checkbox name="5:00 - 5:20 pm" onChange={onTimeChange}>
                  5:00 - 5:20 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="5:20 - 5:40 pm">
                <Checkbox name="5:20 - 5:40 pm" onChange={onTimeChange}>
                  5:20 - 5:40 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="5:40 - 6:00 pm">
                <Checkbox name="5:40 - 6:00 pm" onChange={onTimeChange}>
                  5:40 - 6:00 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="6:00 - 6:20 pm">
                <Checkbox name="6:00 - 6:20 pm" onChange={onTimeChange}>
                  6:00 - 6:20 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="6:20 - 6:40 pm">
                <Checkbox name="6:20 - 6:40 pm" onChange={onTimeChange}>
                  6:20 - 6:40 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="6:40 - 7:00 pm">
                <Checkbox name="6:40 - 7:00 pm" onChange={onTimeChange}>
                  6:40 - 7:00 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="7:00 - 7:20 pm">
                <Checkbox name="7:00 - 7:20 pm" onChange={onTimeChange}>
                  7:00 - 7:20 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="7:20 - 7:40 pm">
                <Checkbox name="7:20 - 7:40 pm" onChange={onTimeChange}>
                  7:20 - 7:40 pm
                </Checkbox>
              </Form.Item>
              <Form.Item name="7:40 - 8:00 pm">
                <Checkbox name="7:40 - 8:00 pm" onChange={onTimeChange}>
                  7:40 - 8:00 pm
                </Checkbox>
              </Form.Item>
            </Box>
          </Panel>
        </Collapse>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
          // onClick={handleSubmit}
          type="submit"
          disabled={!date || !time.length}
        >
          Add Schedule
        </Button>
      </Form>
      <Toaster />
    </Layout>
  );
};

export default DoctorSchedule;
