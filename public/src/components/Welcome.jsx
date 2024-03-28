import React from "react";
import Robot from "../assets/robot.gif";

export default function Welcome({ currentUser }) {
  return (
    <div className="flex justify-center items-center w-[70%] flex-col">
      <img src={Robot} alt="Robot" className="h-80" />
      <h1 className="text-purple-600 text-3xl font-bold mb-2">
        Welcome,{" "}
        <span className="text-purple-600">{currentUser.username}!</span>
      </h1>
      <h3 className="text-white text-xl">
        Please select a chat to start Messaging.
      </h3>
    </div>
  );
}
