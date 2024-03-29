import React, { useState } from "react";
import Logout from "./Logout";

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const changeCurrentChat = (index, contacts) => {
    setCurrentSelected(index);
    changeChat(contacts);
  };

  return (
    <>
      {currentUser && currentUser.avatarImage && currentUser.username && (
        <div className="flex flex-col h-[88vh] w-[28%] bg-[#242930] border-r border-r-[#75767780]">
          <div className="flex flex-col w-full items-center overflow-auto gap-2 flex-grow pt-3">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 cursor-pointer w-[95%] bg-[#242930] rounded p-3 transition duration-500 ease-in-out ${
                  index === currentSelected ? "bg-purple-600" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div>
                  <img
                    src={`${contact.avatarImage}`}
                    alt="avatar"
                    className="h-10"
                  />
                </div>
                <p className="text-white text-lg">{contact.username}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center bg-[#1b2028] m-2 rounded-2xl p-4">
            <img
              src={`${currentUser.avatarImage}`}
              alt="avatar"
              className="h-12 mr-3"
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
