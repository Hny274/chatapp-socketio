import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import { IoMdClose } from "react-icons/io";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const [viewImage, setViewImage] = useState(false);
  const [image, setImage] = useState();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentUser && currentUser._id && currentChat) {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    const timestamp = Date.now();
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
      timestamp: timestamp,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
      timestamp: timestamp,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { fromSelf: true, message: msg, timestamp: timestamp },
    ]);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", ({ message, timestamp }) => {
        setArrivalMessage({
          fromSelf: false,
          message: message,
          timestamp: timestamp,
        });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {viewImage && (
        <div className="h-[100vh] w-full bg-black/40 backdrop-blur-sm absolute top-0 z-30 flex justify-center items-center">
          <div className="w-[50%] flex justify-end items-end flex-col">
            <button
              onClick={() => {
                setImage();
                setViewImage(false);
              }}
              className="bg-purple-600 text-white p-3 mb-3 rounded-full relative"
            >
              <IoMdClose />
            </button>
            <img src={image} alt="" className="w-full" />
          </div>
        </div>
      )}
      {currentChat && (
        <div className="flex flex-col h-[88vh] w-[72%] bg-[#1b2028]">
          <div
            className="px-8 flex flex-col gap-4 overflow-y-scroll h-full pb-2 bg-[#1b2028] my-4"
            ref={scrollRef}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                ref={scrollRef}
                className={`${msg.fromSelf ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col items-start justify-end">
                  {!msg.message?.includes("cloudinary") ? (
                    <div
                      className={`max-w-[40%] overflow-wrap break-word px-4 py-2 ${
                        msg.fromSelf
                          ? "ml-auto rounded-l-xl rounded-t-xl text-white bg-[#373b41]"
                          : "bg-purple-600 rounded-r-xl rounded-t-xl text-gray-100"
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                  ) : (
                    <img
                      onClick={() => {
                        setImage(msg.message);
                        setViewImage(true);
                      }}
                      src={msg.message}
                      className={`max-w-[40%] ${
                        msg.fromSelf
                          ? "ml-auto rounded-l-xl rounded-t-xl text-white border-4 border-[#373b41]"
                          : "border-purple-600 border-4 rounded-r-xl rounded-t-xl text-gray-100"
                      }`}
                      alt=""
                    />
                  )}
                  <p
                    className={`text-white/60 text-sm mt-1 ${
                      msg.fromSelf && "ml-auto"
                    }`}
                  >
                    {formatDate(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </div>
      )}
    </>
  );
}

const formatDate = (date) => {
  const parsedDate =
    typeof date === "string" ? new Date(date) : new Date(parseInt(date));

  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
  const seconds = String(parsedDate.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};
