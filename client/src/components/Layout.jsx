import { Badge } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../layout.css";
import { getUserProfile, removeUser, userStatus } from "../redux/userSlice";
import { logout } from "../api/api";
import { Typography } from "@mui/material";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import axios from "axios";
import { setBackgroundColor } from "../redux/customizationSlice";

const Layout = ({ children }) => {
  // const BASE_URL = "http://localhost:5000/api";
  const BASE_URL = "https://starwheal.onrender.com/api";

  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // const storedColor = localStorage.getItem("backgroundColor");
  // const defaultColor = "#005555";

  // // Access the backgroundColor from the Redux store
  const backgroundColor = useSelector(
    (state) => state.customization.backgroundColor
  );

  // // Update the stored color in localStorage whenever backgroundColor changes
  // useEffect(() => {
  //   localStorage.setItem("backgroundColor", backgroundColor);
  // }, [backgroundColor]);

  // const defaultColor = "#005555";

  // // Access the backgroundColor from the Redux store
  // const backgroundColor = useSelector((state) => {
  //   const storedColor = localStorage.getItem("backgroundColor");
  //   return storedColor || state.customization.backgroundColor || defaultColor;
  // });

  // // Update the stored color in localStorage whenever backgroundColor changes
  // useEffect(() => {
  //   localStorage.setItem("backgroundColor", backgroundColor);
  // }, [backgroundColor]);

  // const getStoredColor = () => {
  //   const storedColor = localStorage.getItem("backgroundColor");
  //   return storedColor || "#005555"; // Default color if no stored value
  // };

  // // const backgroundColor = useSelector(
  // //   (state) => state.customization.backgroundColor
  // // );
  // const backgroundColor =
  //   useSelector((state) => state.customization.backgroundColor) ||
  //   getStoredColor();
  // const [backgroundColor, setBackgroundColor] = useState("#005555");
  const [logo, setLogo] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [notification, setNotification] = useState([]);
  // const { user } = useSelector((state) => state.user);
  const user = useSelector(getUserProfile);
  console.log("USER", user);

  console.log("wala na notif", notification);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("user");
      dispatch(userStatus(false));
      dispatch(removeUser());
      localStorage.removeItem("user");
      navigate("/login");
    },
  });

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
        // const storedColor = localStorage.getItem("backgroundColor");
        // const storedColor = setLogo(response.data.data.backgroundColor);
        // dispatch(setBackgroundColor(logo)); // Set the color from storage
        dispatch(setBackgroundColor(response.data.data.backgroundColor));
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const getNotifications = async () => {
    try {
      dispatch(showLoading());
      const response = await api.get(
        "/user/get-notifications",
        {
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
        setNotification(response.data.data);
        // setTotalPages(response.totalPages);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  // const getLogo = async () => {
  //   try {
  //     dispatch(showLoading());
  //     const response = await api.get("/admin/get-logo");
  //     dispatch(hideLoading());
  //     if (response.data.success) {
  //       // setLogo(response.data.data);

  //       setBackgroundColor(response.data.data.backgroundColor);
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //   }
  // };

  useEffect(() => {
    getNotifications();
    getLogo();
  }, []);

  // const notif = notification?.map((notification) =>
  //   notification?.filter((notif) => notif.unseeNotification)
  // );

  // console.log("hey", notif);

  // const notif = notification[0].unseenNotification?.map(
  //   (unseen) => unseen.message
  // );
  const notif = notification.map((item) =>
    item.unseenNotification?.map((unseen) => unseen.message)
  );

  // const count = notif;
  const count = notif.flat().length > 0 ? notif.flat().length : null;

  console.log("hey", count);

  const handleLogout = () => {
    mutation.mutate();
  };

  const patientMenu = [
    {
      name: "Book Appointment",
      path: "/",
      icon: "ri-home-3-line",
    },
    {
      name: "Chat",
      path: "/chat",
      icon: "ri-message-2-fill",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-3-line",
    },
    // {
    //   name: "Apply Doctor",
    //   path: "/applyDoctor",
    //   icon: "ri-hospital-line",
    // },
    {
      name: "Profile",
      path: `/patient/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const doctorMenu = [
    {
      name: "Dashboard",
      path: "/",
      icon: "ri-home-3-line",
    },
    {
      name: "Chat",
      path: "/chat",
      icon: "ri-message-2-fill",
    },
    {
      name: "Medical Records",
      path: "/admin/patient-record",
      icon: "ri-folder-user-line",
    },
    // {
    //   name: "DoctorInformation",
    //   path: "/applyDoctor",
    //   icon: "ri-hospital-line",
    // },
    {
      name: "Create Schedule",
      path: "/doctor-schedule",
      icon: "ri-calendar-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-3-line",
    },

    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const ApplydoctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-3-line",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-3-line",
    },
    {
      name: "Apply Doctor",
      path: "/applyDoctor",
      icon: "ri-hospital-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/",
      icon: "ri-home-3-line",
    },
    // {
    //   name: "Chat",
    //   path: "/chat",
    //   icon: "ri-message-2-fill",
    // },
    // {
    //   name: "Patient Record",
    //   path: "/admin/patient-record",
    //   icon: "ri-folder-user-line",
    // },
    {
      name: "Doctors",
      path: "/admin/doctor-account",
      icon: "ri-account-pin-box-line",
    },
    {
      name: "Patients",
      path: "/admin/userslist",
      icon: "ri-folder-user-line",
    },
    {
      name: "Services",
      path: "/admin/clinic-service",
      icon: "ri-service-fill",
    },
    // {
    //   name: 'Doctors',
    //   path: '/admin/doctorslist',
    //   icon: 'ri-hospital-line',
    // },
    {
      name: "Settings",
      path: "/admin/customization",
      icon: "ri-settings-3-line",
    },
  ];

  const users = {
    admin: adminMenu,
    patient: patientMenu,
    doctor: doctorMenu,
  };

  const currentUser = users[user?.userType];

  return (
    <div className="main">
      <div className="d-flex layout">
        {!collapsed && (
          <div className="sidebar" style={{ backgroundColor: backgroundColor }}>
            <div className="sidebar-header">
              {/* <h1 className="logo">SMC</h1>
            <Typography textAlign="center" fontSize={15} color="white">
              {user.userType.toUpperCase()}
            </Typography> */}
              {!collapsed && <h1 className="logo">SMC</h1>}
              {!collapsed && (
                <Typography textAlign="center" fontSize={15} color="white">
                  {user?.userType?.toUpperCase()}
                </Typography>
              )}
            </div>
            <div className="menu">
              {currentUser?.map((menus, i) => {
                const isActive = location.pathname === menus.path;
                return (
                  <div
                    className={`d-flex menu-item ${
                      isActive && "active-menu-item"
                    }`}
                    key={i}
                  >
                    {/* <i className={menus.icon}></i>
                  {!collapsed && <Link to={menus.path}>{menus.name}</Link>} */}
                    {!collapsed && <i className={menus.icon}></i>}
                    {!collapsed && <Link to={menus.path}>{menus.name}</Link>}
                  </div>
                );
              })}

              <div className={`d-flex menu-item`} onClick={handleLogout}>
                {/* <i className="ri-logout-circle-line"></i>
              {!collapsed && <Link to="/">Logout</Link>} */}
                {!collapsed && <i className="ri-logout-circle-line"></i>}
                {!collapsed && <Link to="/">Logout</Link>}
              </div>
            </div>
          </div>
        )}
        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-2-fill header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-circle-fill header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}
            <Typography fontWeight="bold" fontSize={20} mr="auto" ml={4}>
              Hello {user?.firstname.toUpperCase()}
            </Typography>

            <div className="d-flex align-items-center px-4">
              <Badge count={count} onClick={() => navigate("/notifications")}>
                <i className="ri-notification-2-line header-action-icon px-3"></i>
              </Badge>

              <Link className="anchor mx-3" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
