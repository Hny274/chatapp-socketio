import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
import { IoIosChatboxes } from "react-icons/io";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "", // Changed from email to username
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username } = values; // Changed from email to username
      try {
        const { data } = await axios.post(loginRoute, {
          username, // Changed from email to username
          password,
        });
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
          navigate("/");
        }
      } catch (error) {
        console.error("Login Error:", error);
        toast.error("An error occurred. Please try again later.", toastOptions);
      }
    }
  };

  const handleValidation = () => {
    const { password, username } = values; // Changed from email to username
    if (password === "" || username === "") {
      // Changed from email to username
      toast.error("Username and password are required", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div className="h-[100vh] w-full flex flex-col justify-center items-center gap-4 bg-gray-800">
        <div className="bg-gray-900 rounded-lg p-8 w-[33%]">
          <div className="flex items-center justify-center mb-3">
            <IoIosChatboxes className="text-purple-500" size={60} />
            <h1 className="text-white text-4xl w-full ml-4">ChatApp</h1>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div>
              <label
                htmlFor="username" // Changed from email to username
                className="block font-medium text-gray-300"
              >
                Username
              </label>
              <input
                type="text" // Changed from email to text
                id="username" // Changed from email to username
                name="username" // Changed from email to username
                placeholder="Enter your username" // Updated placeholder text
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent border-2 text-white border-purple-800 px-3 py-3 shadow-sm outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block font-medium text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent border-2 text-white border-purple-800 px-3 py-3 shadow-sm outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-3 mt-2 py-2 rounded-md bg-purple-600 mb-4"
            >
              Login
            </button>
          </form>
          <p className="text-white text-center w-full">
            Don't have an account?
            <Link to="/register" className="text-purple-500 ml-2">
              Register
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
