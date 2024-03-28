import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";
import { IoIosChatboxes } from "react-icons/io";

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username, email } = values;
      try {
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        } else {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
          toast.success("Registration successful!", toastOptions);
          navigate("/");
        }
      } catch (error) {
        console.error("Register Error:", error);
        toast.error("An error occurred. Please try again later.", toastOptions);
      }
    }
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password should match.", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be at least 3 characters long.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be at least 8 characters long.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
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
                htmlFor="username"
                className="block font-medium text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={values.username}
                placeholder="username"
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent border-2 text-white border-purple-800 px-3 py-3 shadow-sm outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                placeholder="hunny@gmail.com"
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
                value={values.password}
                placeholder="********"
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent border-2 text-white border-purple-800 px-3 py-3 shadow-sm outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                placeholder="********"
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent border-2 text-white border-purple-800 px-3 py-3 shadow-sm outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-3 mt-2 py-2 rounded-md bg-purple-600 mb-4"
            >
              Register
            </button>
          </form>
          <p className="text-white text-center w-full">
            Already have an account?
            <Link to="/login" className="text-purple-500 ml-2">
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register;
