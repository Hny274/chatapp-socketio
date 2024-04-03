import React from "react";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import FriendList from "./FriendList";
import GroupList from "./GroupList";

export default function Contacts({
  contacts,
  currentUser,
  changeChat,
  setContacts,
  setGroup,
  setCurrentGroupChat,
  currentGroupChat,
  setCurrentChat,
  tab,
  setTab,
  socket,
}) {
  const navigate = useNavigate();

  const handleTabClick = (tabNumber, setGroupValue, setCurrentChatValue) => {
    setTab(tabNumber);
    setGroup(setGroupValue);
    setCurrentGroupChat(undefined);
    setCurrentChatValue(undefined);
  };

  return (
    <>
      {currentUser && currentUser.avatarImage && currentUser.username && (
        <div className="flex flex-col h-[88vh] w-[28%] bg-[#242930] border-r border-r-[#75767780]">
          <div className="flex justify-evenly items-center w-[95%] mx-auto mt-3 gap-4">
            <button
              className={`w-full p-2 rounded-2xl ${
                tab === 1
                  ? "text-[#fff] bg-[#1b2028] "
                  : "text-[#757677] hover:bg-[#1b202880]"
              }`}
              onClick={() => handleTabClick(1, false, setCurrentChat)}
            >
              All Chats
            </button>
            <button
              className={`w-full p-2 rounded-2xl ${
                tab === 2
                  ? "text-[#fff] bg-[#1b2028] "
                  : "text-[#757677] hover:bg-[#1b202880]"
              }`}
              onClick={() => handleTabClick(2, true, setCurrentGroupChat)}
            >
              Groups
            </button>
          </div>
          {tab === 1 && (
            <FriendList
              contacts={contacts}
              currentUser={currentUser}
              changeChat={changeChat}
              setContacts={setContacts}
              socket={socket}
            />
          )}
          {tab === 2 && (
            <GroupList
              contacts={contacts}
              currentUser={currentUser}
              changeChat={changeChat}
              setContacts={setContacts}
              setCurrentGroupChat={setCurrentGroupChat}
              currentGroupChat={currentGroupChat}
            />
          )}
          <div className="flex items-center justify-center bg-[#1b2028] m-2 rounded-2xl p-4">
            <img
              src={`${currentUser.avatarImage}`}
              alt="avatar"
              className="h-12 mr-3"
              onClick={() => navigate("/setAvatar")}
            />
            <div className="flex justify-between items-center w-full">
              <h2 className="text-white text-xl font-semibold">
                {currentUser.username}
              </h2>
              <Logout />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
