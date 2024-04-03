import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosChatboxes } from "react-icons/io";
import toast from "react-hot-toast";
import { BACKEND_LINK } from "../utils/baseApi";
function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username, email } = values;
      try {
        const { data } = await axios.post(`${BACKEND_LINK}/auth/register`, {
          username,
          email,
          password,
        });
        if (data.status === false) {
          toast.error(data.msg);
        } else {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
          toast.success("Registration successful!");
          navigate("/");
        }
      } catch (error) {
        console.error("Register Error:", error);
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  const handleValidation = () => {
    const { password, username, email } = values;
    if (username.length < 3) {
      toast.error("Username should be at least 3 characters long.");
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be at least 8 characters long.");
      return false;
    } else if (email === "") {
      toast.error("Email is required.");
      return false;
    }
    return true;
  };

  return (
    <>
      <section className="min-h-[100vh] w-full flex flex-col justify-center items-center gap-4 bg-gray-900 py-10">
        <div className="rounded-lg p-6 w-[33%] border shadow bg-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-center mb-3">
              <IoIosChatboxes className="text-purple-500" size={60} />
              <p className="text-4xl w-full ml-4">ChatApp</p>
            </div>
            <div className="">
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
                value={values.username}
                placeholder="username"
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent px-3 py-3 outline-none border border-gray-800"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-800"
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
                value={values.password}
                placeholder="***********"
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent px-3 py-3 outline-none border border-gray-800"
              />
            </div>

            <button
              type="submit"
              className="px-3 mt-2 py-2 rounded-md bg-purple-600 text-white mb-4 text-xl transition-animate hover:bg-purple-700"
            >
              Register
            </button>
          </form>
          <p className="text-center w-full">
            Already have an account?
            <Link to="/login" className="text-purple-500 ml-2 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default Register;
