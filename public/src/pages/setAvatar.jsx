import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.webp";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BACKEND_LINK } from "../utils/baseApi";
export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  async function setProfilePicture() {
    try {
      if (selectedAvatar === undefined) {
        toast.error("Please select an avatar");
        return;
      }

      const user = JSON.parse(localStorage.getItem("chat-app-user"));

      const { data } = await axios.post(
        `${BACKEND_LINK}/auth/setAvatar/${user._id}`,
        {
          image: avatars[selectedAvatar],
        }
      );

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.");
      }
    } catch (error) {
      console.error("Error setting avatar:", error);
      toast.error("An error occurred. Please try again later.");
    }
  }

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await Promise.all(
          Array.from({ length: 4 }, async () => {
            const response = await axios.get(
              `${api}/${Math.round(Math.random() * 1000)}`,
              { responseType: "arraybuffer" }
            );
            const imageBuffer = Buffer.from(response.data, "binary");
            return `data:image/svg+xml;base64,${imageBuffer.toString(
              "base64"
            )}`;
          })
        );

        if (isMounted) {
          setAvatars(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        toast.error("An error occurred while fetching avatars.", toastOptions);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [api]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center flex-col h-screen bg-black">
          <img src={loader} alt="loader" className="max-w-full" />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col h-screen bg-black">
          <div className="text-white mb-8">
            <h1 className="text-3xl font-bold">
              Pick an Avatar as your profile picture
            </h1>
          </div>
          <div className="flex gap-8">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar rounded-full p-2 border-4 cursor-pointer ${
                  selectedAvatar === index
                    ? "border-purple-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={avatar} alt="avatar" className="w-24 h-24" />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="mt-8 py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          >
            Set as Profile Picture
          </button>
        </div>
      )}
    </>
  );
}
