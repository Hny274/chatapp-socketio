import React, { useState, useEffect, useRef } from "react";
import GrpChatInput from "./GrpChatInput";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { BACKEND_LINK } from "../../utils/baseApi";

const GrpChatContainer = ({ socket, currentGroupChat, currentUser }) => {
  const [grpData, setGrpData] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const [viewImage, setViewImage] = useState(false);
  const [image, setImage] = useState();

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_LINK}/group/getGroup/${currentGroupChat?._id}`
        );
        setGrpData(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    if (currentGroupChat) {
      fetchGroupData();
    }
  }, [currentGroupChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive-grp", (data) => {
        setArrivalMessage(data);
      });
    }
  }, [socket]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [grpData.messages]);

  useEffect(() => {
    if (arrivalMessage) {
      if (arrivalMessage?.groupId === currentGroupChat?._id) {
        setGrpData((prevData) => ({
          ...prevData,
          messages: [...(prevData.messages || []), arrivalMessage],
        }));
      }
    }
  }, [arrivalMessage, currentGroupChat?._id]);

  const handleSendMsg = async (msg) => {
    const timestamp = Date.now();
    try {
      await axios.post(`${BACKEND_LINK}/group/addMessage`, {
        groupId: currentGroupChat._id,
        message: msg,
        sender: currentUser._id,
      });

      socket.current.emit("send-msg-grp", {
        groupId: currentGroupChat?._id,
        message: msg,
        sender: {
          _id: currentUser?._id,
          username: currentUser.username,
        },
        createdAt: timestamp,
      });

      setGrpData((prevData) => ({
        ...prevData,
        messages: [
          ...(prevData.messages || []),
          {
            message: msg,
            sender: currentUser,
            createdAt: timestamp,
          },
        ],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatDateForDisplay = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

      <div className="flex flex-col h-[88vh] w-[72%] bg-[#1b2028]">
        <div
          className="px-8 flex flex-col gap-4 overflow-y-scroll h-full pb-2 bg-[#1b2028] my-4"
          ref={scrollRef}
        >
          {grpData.messages &&
            grpData.messages.map((msg, index) => (
              <React.Fragment key={index}>
                {index === 0 ||
                formatDateForDisplay(msg.createdAt) !==
                  formatDateForDisplay(
                    grpData.messages[index - 1].createdAt
                  ) ? (
                  <div className="flex justify-center mb-2">
                    <div className="bg-gray-500 px-2 py-1 rounded-md text-xs">
                      {formatDateForDisplay(msg.createdAt)}
                    </div>
                  </div>
                ) : null}
                <div
                  className={`${
                    msg.sender?._id === currentUser._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="flex flex-col items-start justify-end">
                    <div
                      className={`max-w-[40%] overflow-wrap break-word px-4 py-2 ${
                        msg.sender?._id === currentUser._id
                          ? "ml-auto rounded-l-xl rounded-t-xl text-white bg-[#373b41]"
                          : "bg-purple-600 rounded-r-xl rounded-t-xl text-gray-100"
                      }`}
                    >
                      {msg.sender?._id !== currentUser._id && (
                        <p
                          className={`text-white/60 text-sm tracking-wider ${
                            msg.sender?._id === currentUser._id && "ml-auto"
                          }`}
                        >
                          {msg.sender.username}
                        </p>
                      )}
                      {!msg.message?.includes("cloudinary") ? (
                        <p>{msg.message}</p>
                      ) : (
                        <img
                          onClick={() => {
                            setImage(msg.message);
                            setViewImage(true);
                          }}
                          src={msg.message}
                          className={`max-w-[100%] ${
                            msg.sender?._id === currentUser._id
                              ? "ml-auto rounded-l-xl rounded-t-xl text-white border-4 border-[#373b41]"
                              : "border-purple-600 border-4 rounded-r-xl rounded-t-xl text-gray-100"
                          }`}
                          alt=""
                        />
                      )}
                    </div>
                    <p
                      className={`text-white/60 text-sm mt-1 tracking-wider ${
                        msg.sender?._id === currentUser._id && "ml-auto"
                      }`}
                    >
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            ))}
        </div>
        <GrpChatInput handleSendMsg={handleSendMsg} />
      </div>
    </>
  );
};

export default GrpChatContainer;

const formatDate = (date) => {
  const parsedDate =
    typeof date === "string" ? new Date(date) : new Date(parseInt(date));

  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
  const seconds = String(parsedDate.getSeconds()).padStart(2, "0");

  const formattedDate = `${hours}:${minutes}:${seconds}`;

  return formattedDate;
};
