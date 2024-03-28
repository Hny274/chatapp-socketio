import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (_, emoji) => {
    let message = msg + emoji.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="flex items-center bg-gray-900 px-4 py-2">
      <div className="flex items-center text-white">
        <div className="relative">
          <BsEmojiSmileFill
            onClick={handleEmojiPickerHideShow}
            className="text-yellow-400 cursor-pointer"
          />
          {showEmojiPicker && (
            <Picker
              className="absolute top-[-1000px] bg-gray-900 shadow-md border border-purple-500 z-10 max-h-40 overflow-y-auto"
              onEmojiClick={handleEmojiClick}
            />
          )}
        </div>
      </div>
      <form className="flex flex-grow ml-4" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="Type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="flex-grow h-10 bg-transparent text-white outline-none px-4 placeholder-gray-400"
        />
        <button
          type="submit"
          className="ml-2 flex items-center justify-center bg-purple-500 rounded-full p-2"
        >
          <IoMdSend className="text-white" />
        </button>
      </form>
    </div>
  );
}
