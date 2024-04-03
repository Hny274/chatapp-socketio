import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosChatboxes } from "react-icons/io";
import toast from "react-hot-toast";
import { BACKEND_LINK } from "../utils/baseApi";
import { useLocation } from "react-router-dom";

function VerifyPassword() {
  const navigate = useNavigate();
  const router = useLocation();
  const [values, setValues] = useState({
    password: "",
    cpassword: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { password, cpassword } = values;
    if (password !== cpassword) {
      toast.error("Enter Same Password");
      return;
    }
    try {
      const { data } = await axios.post(`${BACKEND_LINK}/auth/updatePassword`, {
        password,
        token: router.search.replace("?token=", ""),
      });
      if (data.status === false) {
        toast.error(data.msg);
      }
      toast.success("Password Updated!");
      navigate("/login");
    } catch (error) {
      console.error("Verify Password Error:", error);
      toast.dismiss();
      toast.error(error.response.data.message);
    }
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
                htmlFor="password"
                className="block font-medium text-gray-800"
              >
                Updated Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent px-3 py-3 outline-none border border-gray-800"
              />
            </div>
            <div>
              <label
                htmlFor="cpassword"
                className="block font-medium text-gray-800"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="cpassword"
                name="cpassword"
                placeholder="Enter your password"
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-transparent px-3 py-3 outline-none border border-gray-800"
              />
            </div>
            <button
              type="submit"
              className="px-3 mt-2 py-2 rounded-md bg-purple-600 text-white mb-4 text-xl transition-animate hover:bg-purple-700"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default VerifyPassword;
