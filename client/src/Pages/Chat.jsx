import { Row, Col, Input } from "antd";
import { useMediaQuery } from "react-responsive";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout";

import { userChats } from "../api/ChatRequest";
import Conversation from "../components/Conversation/Conversation";
import ChatBox from "../components/ChatBox/ChatBox";
import { io } from "socket.io-client";
import "./chat.css";
import { getUserProfile } from "../redux/userSlice";

const Chat = () => {
  const [chats, setChats] = useState([]);

  const [showChatbox, setShowChatbox] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.user);
  const user = useSelector(getUserProfile);
  const socket = useRef();

  // sending message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  //connect to socket.io
  useEffect(() => {
    socket.current = io("https://starwheal.onrender.com");
    if (user !== null && user !== undefined) {
      socket.current.emit("new-user-add", user._id);

      console.log("null ba?", user._id);
    }
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
      console.log("real-time", users);
    });
  }, [user]);

  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);

      // Find the chat with the new message
      const updatedChats = [...chats];
      const chatIndex = updatedChats.findIndex(
        (chat) => chat._id === data.chatId
      );

      // If the chat exists, move it to the beginning of the array
      if (chatIndex !== -1) {
        const chat = updatedChats.splice(chatIndex, 1)[0];
        updatedChats.unshift(chat);
        setChats(updatedChats);
      }
    });
  }, []);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user?._id);

        setChats(data.reverse()); // Reverse the order of chats
        console.log(data);
      } catch (error) {
        console.log("HIHI", error);
      }
    };
    getChats();
  }, [user?._id]);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const isMobile = useMediaQuery({ query: "(max-width: 1172px)" });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1171px)" });

  const handleConversationClick = (chat) => {
    setCurrentChat(chat);
    setShowChatbox(true);
  };

  return (
    <Layout>
      {!isBigScreen && (
        <Row>
          {!showChatbox && (
            <Col span={6}>
              <div
                className="leftbar-chat2"
                style={{ maxHeight: "100vh", overflowY: "auto" }}
              >
                <h2>Chats</h2>

                <hr />
                {chats.map((chat) => (
                  <div onClick={() => handleConversationClick(chat)}>
                    <Conversation
                      data={chat}
                      currentUserId={user._id}
                      online={checkOnlineStatus(chat)}
                      unRead={receiveMessage?.chatId === chat._id}
                    />
                  </div>
                ))}
              </div>
            </Col>
          )}
          {showChatbox && (
            <Col span={18}>
              <div>
                <ChatBox
                  chat={currentChat}
                  currentUser={user?._id}
                  setSendMessage={setSendMessage}
                  receiveMessage={receiveMessage}
                />
              </div>
            </Col>
          )}
        </Row>
      )}
      {!isMobile && (
        <Row>
          <Col span={6}>
            <div
              className="leftbar-chat"
              style={{ maxHeight: "100vh", overflowY: "auto" }}
            >
              <h2>Chats</h2>

              <hr />
              {chats?.map((chat) => (
                <div onClick={() => handleConversationClick(chat)}>
                  <Conversation
                    data={chat}
                    currentUserId={user._id}
                    online={checkOnlineStatus(chat)}
                    unRead={receiveMessage?.chatId === chat._id}
                  />
                </div>
              ))}
            </div>
          </Col>
          <Col span={18}>
            <div>
              <ChatBox
                chat={currentChat}
                currentUser={user?._id}
                setSendMessage={setSendMessage}
                receiveMessage={receiveMessage}
              />
            </div>
          </Col>
        </Row>
      )}
    </Layout>
  );
};

export default Chat;
