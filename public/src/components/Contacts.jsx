import React, { useState, useEffect } from "react";
import { IoIosChatboxes } from "react-icons/io";

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
        <div className="w-[30%] h-[90vh] overflow-hidden bg-gray-900 border-r-2 border-purple-500 rounded-l-2xl">
          <div className="flex items-center justify-center mb-3 px-4 py-4">
            <IoIosChatboxes className="text-purple-500" size={38} />
            <h1 className="text-white text-2xl w-full ml-4">ChatApp</h1>
          </div>
          <div className="flex flex-col items-center overflow-auto gap-2 scrollbar-thumb-white scrollbar-track-gray-600 flex-grow h-[68%]">
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
                    src={`${contact.avatarImage}`}
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
          <div className="flex items-center w-full border-t-2 border-purple-500 p-4 mt-4">
            <img
              src={`${currentUser.avatarImage}`}
              alt="avatar"
              className="h-12 mr-3"
            />
            <h2 className="text-white text-xl font-semibold">
              {currentUser.username}
            </h2>
          </div>
        </div>
      )}
    </>
  );
}
