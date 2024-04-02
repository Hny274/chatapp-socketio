import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  addFriendRoute,
  getAllFriends,
  getGroupData,
  host,
} from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { IoIosChatboxes } from "react-icons/io";
import toast from "react-hot-toast";
import { MdClose, MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import GrpChatContainer from "../components/Group/GrpChatContainer";

export default function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [group, setGroup] = useState(true);
  const [currentGroupChat, setCurrentGroupChat] = useState();
  const [groupData, setGroupData] = useState();

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(
          `${getGroupData}/getGroup/${currentGroupChat._id}`
        );
        setGroupData(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    currentGroupChat && fetchGroupData();
  }, [currentGroupChat]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem("chat-app-user")) {
          navigate("/login");
        } else {
          const user = JSON.parse(localStorage.getItem("chat-app-user"));
          setCurrentUser(user);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axios.post(
              `${getAllFriends}/${currentUser._id}`
            );
            setContacts(data.friends);
          } catch (error) {
            console.error("Error fetching contacts:", error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchData();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const removeFriendHandler = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to remove this friend?"
      );
      if (!confirmed) return;

      const resp = await axios.post(
        `${addFriendRoute}${currentUser._id}/remove-friend/${currentChat._id}`
      );
      toast.success(resp.data.message);
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  return (
    <div className="h-[100vh] w-full flex flex-col justify-center items-center bg-[#1b2028]">
      <div className="w-full flex justify-between items-center h-[12vh]">
        <div className="flex items-center justify-center bg-[#1b2028] w-[28%] h-full border-b border-r border-b-[#75767780] border-r-[#75767780]">
          <IoIosChatboxes className="text-purple-500 ml-4" size={40} />
          <h1 className="text-white text-2xl w-full ml-3">ChatApp</h1>
        </div>
        {!group && currentChat && (
          <div className="flex justify-between items-center pb-4 px-6 py-4 bg-[#1b2028] w-[72%] h-full relative border-b border-b-[#75767780]">
            <div className="flex justify-center items-center">
              <img
                src={`${currentChat?.avatarImage}`}
                alt="avatar"
                className="h-10"
              />
              <p className="text-white text-2xl ml-4">
                {currentChat?.username}
              </p>
            </div>
            <div className="flex justify-center items-center">
              <button onClick={removeFriendHandler}>
                <MdOutlinePersonRemoveAlt1
                  size={22}
                  className="text-gray-400 cursor-pointer mr-4"
                />
              </button>{" "}
              <button onClick={() => setCurrentChat(undefined)}>
                <MdClose size={22} className="text-gray-400 cursor-pointer" />
              </button>
            </div>
          </div>
        )}
        {group && currentGroupChat && (
          <div className="flex justify-between items-center pb-4 px-6 py-4 bg-[#1b2028] w-[72%] h-full relative border-b border-b-[#75767780]">
            <div className="flex justify-center items-center">
              <img
                src={`${currentGroupChat?.avatar}`}
                alt="avatar"
                className="h-10"
              />
              <div>
                <p className="text-white text-lg ml-4">
                  {currentGroupChat?.name}
                </p>
                <p className="text-white/70 text-sm ml-4">
                  {groupData &&
                    groupData.users.map((item, index) => (
                      <span
                        className={`${
                          item.username === groupData.admin.username &&
                          "text-purple-400"
                        }`}
                      >
                        {item.username}
                        {index + 1 !== groupData.users.length && ", "}
                      </span>
                    ))}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button onClick={() => setCurrentGroupChat(undefined)}>
                <MdClose size={22} className="text-gray-400 cursor-pointer" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-200 flex w-full h-[88vh]">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
          setContacts={setContacts}
          group={group}
          setGroup={setGroup}
          setCurrentGroupChat={setCurrentGroupChat}
          currentGroupChat={currentGroupChat}
        />
        {isLoaded &&
        currentChat === undefined &&
        currentGroupChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : group ? (
          <GrpChatContainer
            currentUser={currentUser}
            socket={socket}
            group={group}
            currentGroupChat={currentGroupChat}
          />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
            group={group}
          />
        )}
      </div>
    </div>
  );
}
