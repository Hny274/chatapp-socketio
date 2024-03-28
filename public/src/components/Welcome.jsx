import React from "react";
import Robot from "../assets/robot.gif";

export default function Welcome({ currentUser }) {
  return (
    <div className="flex justify-center items-center w-[70%] flex-col">
      <img src={Robot} alt="Robot" className="h-80" />
      <h1 className="text-blue-600">
        Welcome, <span className="text-blue-600">{currentUser.username}!</span>
      </h1>
      <h3>Please select a chat to start Messaging.</h3>
    </div>
  );
}
