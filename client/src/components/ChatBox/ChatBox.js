import React, { useEffect, useRef, useState } from "react";
import { getUser } from "../../api/ChatRequest";
import { useMediaQuery } from "react-responsive";
import { addMessage, getMessages } from "../../api/MessageRequest";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { Button, Col } from "antd";
import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageMessage, setImageMessage] = useState(null);
  const scroll = useRef();
  const navigate = useNavigate();
  const inputRef = useRef();

  const isMobile = useMediaQuery({ query: "(max-width: 1172px)" });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1171px)" });

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage?.chatId === chat?._id) {
      console.log("Data received", receiveMessage);
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage, chat?._id]);

  //fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);

        setUserData(data);
        console.log("ChatBox", data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // fetching data for messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
        console.log("Chat messages", data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    console.log("New Message", newMessage);
    setNewMessage(newMessage);
  };

  const handleSend = async (e, image) => {
    e.preventDefault();
    if (newMessage.trim() === "" && !image) {
      return; // Don't send empty messages
    }

    const message = {
      senderId: currentUser,
      text: newMessage,
      image: image,
      chatId: chat._id,
    };
    console.log("mess", message);

    //sending mesage to database
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);

      setNewMessage("");
      if (inputRef.current) {
        inputRef.current.clear();
      }
    } catch (error) {
      console.log(error);
    }

    // send message to socket server
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend(e);
    }
  };

  //Always scroll to last message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onUploadImageClick = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      console.log("img", reader.result);
      handleSend(e, reader.result); // Pass null for the event parameter
    };
  };

  return (
    <React.Fragment>
      <div className="ChatBox-container">
        {chat ? (
          <React.Fragment>
            <div className="chat-header">
              <div className="followers ">
                <div className="d-flex">
                  <div className="mt-2">
                    <ArrowLeftOutlined onClick={() => navigate("/chat")} />
                  </div>

                  <img
                    src={
                      userData?.selectedFile ||
                      "https://th.bing.com/th/id/R.6ae74c5f86466ef4f6fc6253c767381a?rik=5DSgIRvIaK7UPw&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fProfile-Avatar-PNG.png&ehk=GVMh4KTpyOBERsOt5H%2b8TcGp%2bS8DdbR6niBs54kRaYA%3d&risl=&pid=ImgRaw&r=0"
                    }
                    alt="Profile"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50px",
                      marginLeft: "10px",
                      marginRight: "10px",
                    }}
                  />
                  <div className="mt-2">
                    <span>
                      {userData?.firstname} {userData?.lastname}
                    </span>
                  </div>
                </div>
              </div>
              <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
            </div>
            {/*Chatbox Message */}
            <div className="chat-body">
              {messages.map((message) => (
                <React.Fragment>
                  <div
                    ref={scroll}
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="IMG"
                        className="message-image"
                      />
                    )}
                    <span>{format(message.createdAt)}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            {/*Chatbox-sender */}
            {!isBigScreen && (
              <div className="d-flex">
                <div className="chat-sender">
                  {/* <div>+</div> */}
                  <InputEmoji
                    value={newMessage}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />

                  <SendOutlined
                    onClick={handleSend}
                    style={{ fontSize: "24px" }}
                  />
                  <input
                    type="file"
                    id="file"
                    style={{
                      display: "none",
                    }}
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                    // onChange={onUploadImageClick}
                  />
                </div>
              </div>
            )}
            {!isMobile && (
              <div className=" chat-sender2">
                <label for="file">
                  <i class="ri-link cursor-pointer text-xl" typeof="file"></i>
                  <input
                    type="file"
                    id="file"
                    style={{
                      display: "none",
                    }}
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                    onChange={onUploadImageClick}
                  />
                </label>

                <InputEmoji
                  value={newMessage}
                  onChange={handleChange}
                  className="input-field"
                  onKeyDown={handleKeyDown}
                />

                <SendOutlined
                  onClick={handleSend}
                  style={{
                    fontSize: "24px",
                    /* other styles */
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </React.Fragment>
  );
};

export default ChatBox;
