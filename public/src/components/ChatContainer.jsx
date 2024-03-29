import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

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
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { fromSelf: true, message: msg },
    ]);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
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
      {currentChat && (
        <div className="flex flex-col h-[88vh] w-[72%] bg-[#1b2028]">
          <div className="px-8 flex flex-col gap-4 overflow-y-scroll h-full pb-2 bg-[#1b2028] my-4">
            {messages.map((msg, index) => (
              <div
                key={uuidv4()}
                ref={scrollRef}
                className={`${msg.fromSelf ? "justify-end" : "justify-start"}`}
              >
                <div className="flex">
                  <div
                    className={`max-w-[40%] overflow-wrap break-word px-4 py-2 ${
                      msg.fromSelf
                        ? "ml-auto rounded-l-xl rounded-t-xl text-white bg-[#373b41]"
                        : "bg-purple-600 rounded-r-xl rounded-t-xl text-gray-100"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
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
