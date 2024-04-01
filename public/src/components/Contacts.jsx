import React, { useState } from "react";
import Logout from "./Logout";
import { BiSearch } from "react-icons/bi";
import axios from "axios";
import { getSearchUser } from "../utils/APIRoutes";

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchResult, setSearchResult] = useState();
  const [search, setSearch] = useState();
  const changeCurrentChat = (index, contacts) => {
    setCurrentSelected(index);
    changeChat(contacts);
  };

  const searchUserHandler = async () => {
    try {
      const resp = await axios(`${getSearchUser}?q=${search}`);
      setSearchResult(resp.data.user);
    } catch (error) {}
  };

  return (
    <>
      {currentUser && currentUser.avatarImage && currentUser.username && (
        <div className="flex flex-col h-[88vh] w-[28%] bg-[#242930] border-r border-r-[#75767780]">
          <div className="mt-3 mx-auto flex justify-center items-center w-[95%] rounded-full bg-[#1b2028] border-[#75767780]">
            <input
              type="text"
              className="px-4 py-2 text-white bg-transparent w-full rounded-full outline-none"
              placeholder="Enter Friend Username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <BiSearch
              className="mr-4 text-2xl text-white/80"
              onClick={searchUserHandler}
            />
          </div>
          {search && searchResult && (
            <div className="flex flex-col w-full items-center overflow-auto gap-2 pt-4 border-b">
              {searchResult.map((contact, index) => (
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
          )}
          <div className="flex flex-col w-full items-center overflow-auto gap-2 flex-grow pt-4">
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
