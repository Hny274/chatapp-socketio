import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import { TiMediaStopOutline } from "react-icons/ti";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [isListening, setIsListening] = useState(false);

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  const handleSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMsg(transcript);
      };
      recognition.start();
    }
  };

  return (
    <div className="flex items-center bg-[#242930] px-6 py-3 mx-8 mb-4 rounded-full">
      <form className="flex flex-grow" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="Type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="flex-grow bg-transparent text-white outline-none py-1 placeholder-gray-400"
        />
        <button
          className="ml-4 flex items-center justify-center"
          onClick={handleSpeechRecognition}
        >
          {isListening ? (
            <TiMediaStopOutline
              className="text-white/70 hover:text-purple-500"
              size={24}
            />
          ) : (
            <MdOutlineKeyboardVoice
              className="text-white/70 hover:text-purple-500"
              size={24}
            />
          )}
        </button>
        <button className="ml-4 flex items-center justify-center">
          <LuUpload className="text-white/70 hover:text-purple-500" size={22} />
        </button>
        <button type="submit" className="ml-5 flex items-center justify-center">
          <IoMdSend className="text-white/70 hover:text-purple-500" size={24} />
        </button>
      </form>
    </div>
  );
}
