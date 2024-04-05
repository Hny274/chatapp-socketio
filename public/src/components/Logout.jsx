import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import { useUser } from "../context/userContext";

export default function Logout() {
  const { logout } = useUser();
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.clear();
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleClick}
      className="flex justify-center items-center p-2 rounded-md bg-purple-500 border-none cursor-pointer"
    >
      <BiPowerOff className="text-white text-lg" />
    </button>
  );
}
