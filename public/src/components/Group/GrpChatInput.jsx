import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { LuLoader2, LuUpload } from "react-icons/lu";
import axios from "axios";
import { Cloudinary } from "cloudinary-core";

export default function GrpChatInput({ handleSendMsg }) {
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const cloudinary = new Cloudinary({ cloud_name: "db7j1qgnq" });

  const handleFileUpload = async (event) => {
    setUploading(true);
    if (!event.target.files[0]) {
      alert("Please select a file.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      formData.append("upload_preset", "zhgsajor");
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/db7j1qgnq/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload success:", response.data);

      const imageUrl = cloudinary.url(response.data.public_id);
      handleSendMsg(imageUrl);
      setUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
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
        <input
          type="file"
          id="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={handleFileUpload}
          hidden
        />
        {!uploading && (
          <label
            htmlFor="file"
            className="ml-4 flex items-center justify-center"
          >
            <LuUpload
              className="text-white/70 hover:text-purple-500"
              size={22}
            />
          </label>
        )}
        {uploading && (
          <div className="ml-4 flex items-center justify-center">
            <LuLoader2
              className="text-white/70 hover:text-purple-500 animate-spin"
              size={22}
            />
          </div>
        )}
        <button type="submit" className="ml-5 flex items-center justify-center">
          <IoMdSend className="text-white/70 hover:text-purple-500" size={24} />
        </button>
      </form>
    </div>
  );
}
