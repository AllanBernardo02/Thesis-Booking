import { Button, Form, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import FileBase from "react-file-base64";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ChromePicker } from "react-color";
import { setBackgroundColor } from "../../redux/customizationSlice";

const Customization = () => {
  // const BASE_URL = "http://localhost:5000/api";
  const BASE_URL = "https://starwheal.onrender.com/api";

  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  const [form, setForm] = useState({
    selectedFile: "",
  });

  // const [backgroundColor, setBackgroundColor] = useState("#005555");

  const [logo, setLogo] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getStoredColor = () => {
    const storedColor = localStorage.getItem("backgroundColor");
    return storedColor || "#005555"; // Default color if no stored value
  };

  const backgroundColor =
    useSelector((state) => state.customization.backgroundColor) ||
    getStoredColor(); // Initialize with stored color or default color;

  const onFinish = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await api.post("/admin/add-logo", {
        ...form,
        backgroundColor: backgroundColor,
      });

      // setLogo([...logo, { ...form }]);
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success("SuccessFully Added");
        localStorage.setItem("backgroundColor", backgroundColor); // Store the updated color
        setLogo(response.data.data.clinicLogo);
        // await getLogo();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  const getLogo = async () => {
    try {
      dispatch(showLoading());
      const response = await api.get("/admin/get-logo");
      dispatch(hideLoading());
      if (response.data.success) {
        // setLogo(response.data.data);
        setLogo(response.data.data.clinicLogo);
        // setBackgroundColor(response.data.data.backgroundColor);
        // dispatch(setBackgroundColor(response.data.data.backgroundColor));
        const storedColor = localStorage.getItem("backgroundColor");
        dispatch(setBackgroundColor(storedColor)); // Set the color from storage
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  // const handleColorChange = (color) => {
  //   setBackgroundColor(color.hex);
  // };

  const handleColorChange = (color) => {
    // dispatch(setBackgroundColor(color.hex));
    const newColor = color.hex;
    dispatch(setBackgroundColor(newColor)); // Update the color in Redux store
    localStorage.setItem("backgroundColor", newColor); // Store the updated color
  };

  useEffect(() => {
    getLogo();
  }, []);

  console.log("GET LOGO", logo);

  return (
    <Layout>
      <h1>Customization</h1>
      <hr />
      <div>
        {logo && (
          <img
            src={
              logo?.selectedFile ||
              "https://th.bing.com/th/id/R.6ae74c5f86466ef4f6fc6253c767381a?rik=5DSgIRvIaK7UPw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fProfile-Avatar-PNG.png&ehk=GVMh4KTpyOBERsOt5H%2b8TcGp%2bS8DdbR6niBs54kRaYA%3d&risl=&pid=ImgRaw&r=0"
            }
            alt=""
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
        <form layout="vertical" onSubmit={(e) => onFinish(e)}>
          <Form.Item>
            <FileBase
              type="file"
              multiple={false}
              onDone={({ base64 }) =>
                setForm({ ...form, selectedFile: base64 })
              }
            />
          </Form.Item>
          <Form.Item>
            <ChromePicker
              color={backgroundColor}
              onChange={handleColorChange}
            />
          </Form.Item>
          <button className="primary-button my-2">Submit</button>
        </form>
      </div>
    </Layout>
  );
};

export default Customization;
