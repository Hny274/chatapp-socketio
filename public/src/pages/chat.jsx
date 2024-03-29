import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { IoIosChatboxes } from "react-icons/io";

export default function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

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
            const { data } = await axios.get(
              `${allUsersRoute}/${currentUser._id}`
            );
            setContacts(data);
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

  return (
    <div className="h-[100vh] w-full flex flex-col justify-center items-center bg-[#1b2028]">
      <div className="w-full flex justify-between items-center h-[12vh]">
        <div className="flex items-center justify-center bg-[#1b2028] w-[28%] h-full border-b border-r border-b-[#75767780] border-r-[#75767780]">
          <IoIosChatboxes className="text-purple-500 ml-4" size={40} />
          <h1 className="text-white text-2xl w-full ml-3">ChatApp</h1>
        </div>
        {currentChat && (
          <div className="flex justify-start items-center pb-4 px-6 py-4 bg-[#1b2028] w-[72%] h-full relative border-b border-b-[#75767780]">
            <img
              src={`${currentChat?.avatarImage}`}
              alt="avatar"
              className="h-10"
            />
            <p className="text-white text-2xl ml-4">{currentChat?.username}</p>
          </div>
        )}
      </div>
      <div className="bg-gray-200 flex w-full h-[88vh]">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
}
