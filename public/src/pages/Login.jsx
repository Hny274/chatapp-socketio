import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosChatboxes } from "react-icons/io";
import toast from "react-hot-toast";
import { BACKEND_LINK } from "../utils/baseApi";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
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
      const { password, username } = values;
      try {
        const { data } = await axios.post(`${BACKEND_LINK}/auth/login`, {
          username,
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
        toast.dismiss();
        toast.error(error.response.data.message);
      }
    }
  };

  const handleValidation = () => {
    const { password, username } = values;
    if (password === "" || username === "") {
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
      <div className="h-[100vh] w-full flex flex-col justify-center items-center gap-4 bg-gray-900">
        <div className="rounded-lg p-6 w-[33%] border shadow bg-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-center mb-3">
              <IoIosChatboxes className="text-purple-500" size={60} />
              <p className="text-4xl w-full ml-4 font-semibold">Chatify+</p>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-gray-800"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent px-3 py-3 outline-none border border-gray-800"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block font-medium text-gray-800"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="**********"
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent px-3 py-3 outline-none border border-gray-800"
              />
            </div>
            <Link
              to="/forget-password"
              className="text-purple-500 ml-auto hover:underline"
            >
              Forget Password?
            </Link>
            <button
              type="submit"
              className="px-3 mt-2 py-2 rounded-md bg-purple-600 text-white mb-4 text-xl transition-animate hover:bg-purple-700"
            >
              Login
            </button>
          </form>
          <p className="text-center w-full">
            Don't have an account?
            <Link
              to="/register"
              className="text-purple-500 ml-2 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
