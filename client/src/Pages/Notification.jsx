import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { getUserProfile, setUser, userInfo } from "../redux/userSlice";
// import { setUser } from "../redux/userSlice";
import { Spin } from "antd";

const Notification = () => {
  // const BASE_URL = "http://localhost:5000/api";
  const BASE_URL = "https://starwheal.onrender.com/api";

  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  const navigate = useNavigate();
  const [notification, setNotification] = useState([]);
  const [notificationSeen, setNotificationSeen] = useState([]);
  // const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const user = useSelector(getUserProfile);
  const dispatch = useDispatch();

  console.log("Notifications", user);
  console.log("Notif", notification);

  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await api.post(
        "/user/mark-all-notifications-as-seen",
        {
          userId: user._id,
          userType: user.userType,
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
        // dispatch(setUser(response.data.data));
        setNotification((prevState) => ({
          ...prevState,
          unseenNotification: [], // Assuming you want to clear the unseen notifications
        }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  const getNotifications = async () => {
    try {
      dispatch(showLoading());
      const response = await api.get("/user/get-notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setNotification(response.data.data);
        // setTotalPages(response.totalPages);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const getNotificationsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await api.get("/user/get-notifications-seen", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setNotificationSeen(response.data.data);
        setLoading(false);
        // setTotalPages(response.totalPages);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      const response = await api.post(
        "/user/delete-all-notifications",
        {
          userId: user._id,
          userType: user.userType,
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
        setNotificationSeen((prevState) => ({
          ...prevState,
          seenNotification: [], // Assuming you want to clear the unseen notifications
        }));
        // dispatch(setUser(response.data.data));
        // dispatch(userInfo(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getNotifications();
    getNotificationsSeen();
  }, []);

  return (
    <React.Fragment>
      <Layout>
        <h1 className="page-title">Notifications</h1>
        <Tabs>
          <Tabs.TabPane tab="Unseen" key={0}>
            <div className="d-flex justify-content-end">
              <h1
                className="anchor"
                onClick={markAllAsSeen}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Mark all as seen
              </h1>
            </div>

            {/* {notification?.map((notification) => (
              <div className="card-text">
                {notification?.unseenNotification?.map((notification) => (
                  <div
                    className="card p-2"
                    onClick={() => navigate(notification.onClickPath)}
                  >
                    <p>{notification.message}</p>
                  </div>
                ))}
              </div>
            ))} */}
            {/* {notification?.map((n) => (
              <div className="card-text">
                <div
                  className="card p-2"
                  onClick={() => navigate(n.onClickPath)}
                >
                  <p>{n.message}</p>
                </div>
              </div>
            ))} */}
            {Array.isArray(notification)
              ? notification.map((n) => (
                  <div className="card-text" key={n.id}>
                    <div
                      className="card p-2"
                      onClick={() => navigate(n.onClickPath)}
                    >
                      <p>{n.message}</p>
                    </div>
                  </div>
                ))
              : null}
            {/* {notification &&
              Array.isArray(notification) &&
              notification.map((item) => (
                <div className="card-text">
                  {item.unseenNotification &&
                    Array.isArray(item.unseenNotification) &&
                    item.unseenNotification.map((notification) => (
                      <div
                        className="card p-2"
                        onClick={() => navigate(notification.onClickPath)}
                      >
                        <p>{notification.message}</p>
                      </div>
                    ))}
                </div>
              ))} */}
          </Tabs.TabPane>

          <Tabs.TabPane tab="Seen" key={1}>
            <div className="d-flex justify-content-end">
              <h1
                className="anchor"
                onClick={deleteAll}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Delete All
              </h1>
            </div>

            {/* {notification?.map((notification) => (
              <div className="card-text">
                {notification?.seenNotification?.map((notification) => (
                  <div
                    className="card p-2"
                    onClick={() => navigate(notification.onClickPath)}
                  >
                    <p>{notification.message}</p>
                  </div>
                ))}
              </div>
            ))} */}
            {/* {notificationSeen?.map((n) => (
              <div className="card-text">
                <div className="card p-2">
                  <p>{n.message}</p>
                </div>
              </div>
            ))} */}
            {loading ? (
              <Spin size="large" />
            ) : (
              Array.isArray(notificationSeen) &&
              notificationSeen.map((n) => (
                <div className="card-text" key={n.id}>
                  <div className="card p-2">
                    <p>{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </Tabs.TabPane>
        </Tabs>
      </Layout>
    </React.Fragment>
  );
};

export default Notification;
