import axios from "axios";
import React, { useState } from "react";
import { addFriendRoute, getSearchUser } from "../utils/APIRoutes";
import { LuX } from "react-icons/lu";
import { BiSearch } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoPersonAddOutline } from "react-icons/io5";

const FriendList = ({ contacts, currentUser, changeChat, setContacts }) => {
  const [searchResult, setSearchResult] = useState();
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const changeCurrentChat = (index, contacts) => {
    setCurrentSelected(index);
    changeChat(contacts);
  };

  const searchUserHandler = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios(`${getSearchUser}?q=${search}`);
      const searchData = resp.data.user;
      const updatedData = searchData.filter((user) => {
        return !contacts.some((contact) => contact.username === user.username);
      });
      setSearchResult(updatedData);
      setSearchActive(true);
    } catch (error) {
      console.error("Error while searching users:", error);
    }
  };

  const addFriendHandler = async (friend) => {
    try {
      const resp = await axios.post(
        `${addFriendRoute}${currentUser._id}/add-friend/${friend._id}`
      );
      toast.success(resp.data.message);
      setContacts((prevContacts) => [...prevContacts, friend]);
      setSearch("");
      setSearchResult();
      setSearchActive(false);
    } catch (error) {}
  };
  return (
    <>
      <form
        className="mt-3 mx-auto flex justify-center items-center w-[95%] rounded-full bg-[#1b2028] border-[#75767780]"
        onSubmit={searchUserHandler}
      >
        <input
          type="text"
          className="px-4 py-2 text-white bg-transparent w-full rounded-full outline-none"
          placeholder="Enter Friend Username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {searchResult ? (
          <LuX
            className="mr-4 text-2xl text-white/80 cursor-pointer"
            onClick={() => {
              setSearch("");
              setSearchActive(false);
              setSearchResult();
            }}
          />
        ) : (
          <BiSearch
            className="mr-4 text-2xl text-white/80 cursor-pointer"
            type="submit"
            onClick={searchUserHandler}
          />
        )}
      </form>
      {search && searchResult && searchActive && (
        <div className="flex flex-col w-full items-center overflow-auto gap-2 flex-grow pt-4">
          <p className="text-gray-500 text-left w-[90%]">Search Results: </p>
          {searchResult.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 cursor-pointer w-[95%] bg-[#242930] rounded p-3 transition duration-500 ease-in-out"
              onClick={() => addFriendHandler(contact)}
            >
              <div className="flex justify-center items-center">
                <img
                  src={`${contact.avatarImage}`}
                  alt="avatar"
                  className="h-10 mr-2"
                />
                <p className="text-white text-lg">{contact.username}</p>
              </div>
              <IoPersonAddOutline className="text-white" size={20} />
            </div>
          ))}
        </div>
      )}
      {!searchActive && (
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
      )}
    </>
  );
};

export default FriendList;
