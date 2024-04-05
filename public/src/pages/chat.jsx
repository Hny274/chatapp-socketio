import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { IoIosChatboxes } from "react-icons/io";
import GrpChatContainer from "../components/Group/GrpChatContainer";
import GrpHeader from "../components/Group/GrpHeader";
import ChatHeader from "../components/ChatHeader";
import { BACKEND_LINK, SOCKET_HOST } from "../utils/baseApi";
import { useUser } from "../context/userContext";

export default function Chat() {
  const socket = useRef();
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [group, setGroup] = useState();
  const [currentGroupChat, setCurrentGroupChat] = useState();
  const [groupData, setGroupData] = useState();
  const { user, logout, login } = useUser();
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_LINK}/group/getGroup/${currentGroupChat._id}`
        );
        setGroupData(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    currentGroupChat && fetchGroupData();
  }, [currentGroupChat]);

  useEffect(() => {
    const getUserData = async (token) => {
      try {
        const resp = await axios.get(`${BACKEND_LINK}/auth/myDetails`, {
          data: {},
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        login(resp.data);
        setCurrentUser(resp.data);
        setIsLoaded(true);
      } catch (error) {
        logout();
        navigate("/login");
      }
    };

    const fetchData = async () => {
      try {
        if (!localStorage.getItem("chat-token")) {
          navigate("/login");
        } else {
          getUserData(localStorage.getItem("chat-token"));
          setIsLoaded(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(SOCKET_HOST);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axios.post(
              `${BACKEND_LINK}/auth/getFriends/${currentUser._id}`
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

  return (
    <div className="h-[100vh] w-full flex flex-col justify-center items-center bg-[#1b2028]">
      <div className="w-full flex justify-between items-center h-[12vh]">
        <div className="flex items-center justify-center bg-[#1b2028] w-[28%] h-full border-b border-r border-b-[#75767780] border-r-[#75767780]">
          <IoIosChatboxes className="text-purple-500 ml-4" size={40} />
          <h1 className="text-white text-2xl w-full ml-3">Chatify+</h1>
        </div>
        {!group && currentChat && (
          <ChatHeader
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            currentUser={currentUser}
          />
        )}
        {group && currentGroupChat && (
          <GrpHeader
            setCurrentGroupChat={setCurrentGroupChat}
            currentGroupChat={currentGroupChat}
            groupData={groupData}
            currentUser={currentUser}
            setTab={setTab}
          />
        )}
      </div>
      <div className="bg-gray-200 flex w-full h-[88vh]">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          setCurrentChat={setCurrentChat}
          changeChat={handleChatChange}
          setContacts={setContacts}
          group={group}
          setGroup={setGroup}
          setCurrentGroupChat={setCurrentGroupChat}
          currentGroupChat={currentGroupChat}
          tab={tab}
          setTab={setTab}
          socket={socket}
        />
        {isLoaded &&
          (currentChat === undefined && currentGroupChat === undefined ? (
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
          ))}
      </div>
    </div>
  );
}
