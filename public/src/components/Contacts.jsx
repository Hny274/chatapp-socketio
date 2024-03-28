import React, { useState, useEffect } from "react";
import Logo from "../assets/logo1.png";

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.avatarImage);
      setCurrentUserImage(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contacts) => {
    setCurrentSelected(index);
    changeChat(contacts);
  };

  return (
    <>
      {currentUser && currentUser.avatarImage && currentUser.username && (
        <div className="w-[30%] overflow-hidden bg-gray-900">
          <div className="flex items-center justify-center gap-4">
            <img src={Logo} alt="logo" className="h-8" />
            <h3 className="text-white">ChatApp</h3>
          </div>
          <div className="flex flex-col items-center overflow-auto gap-2 scrollbar-thumb-white scrollbar-track-gray-600">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 cursor-pointer w-11/12 bg-gray-800 rounded p-2 transition duration-500 ease-in-out ${
                  index === currentSelected ? "bg-purple-600" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div>
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt="avatar"
                    className="h-12"
                  />
                </div>
                <div className="text-white">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-8">
            <div>
              <img
                src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                alt="avatar"
                className="h-16 max-w-full"
              />
            </div>
            <div className="text-white">
              <h2>{currentUser.username}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
