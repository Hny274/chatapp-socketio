import React from "react";
import { MdClose, MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_LINK } from "../utils/baseApi";

const ChatHeader = ({ currentChat, setCurrentChat, currentUser }) => {
  const removeFriendHandler = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to remove this friend?"
      );
      if (!confirmed) return;

      const response = await axios.post(
        `${BACKEND_LINK}/auth/${currentUser._id}/remove-friend/${currentChat._id}`
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend");
    }
  };

  return (
    <div className="flex justify-between items-center pb-4 px-6 py-4 bg-[#1b2028] w-[72%] h-full relative border-b border-b-[#75767780]">
      <div className="flex items-center">
        <img src={currentChat?.avatarImage} alt="avatar" className="h-10" />
        <p className="text-white text-2xl ml-4">{currentChat?.username}</p>
      </div>
      <div className="flex items-center">
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
  );
};

export default ChatHeader;
