import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuX } from "react-icons/lu";
import { BiSearch } from "react-icons/bi";
import { IoAdd, IoPersonAddOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { Buffer } from "buffer";
import { BACKEND_LINK } from "../utils/baseApi";

const GroupList = ({ currentUser, setCurrentGroupChat }) => {
  const [groups, setGroups] = useState([]);
  const [addGrpPopup, setAddGrpPopup] = useState(false);
  const [searchResult, setSearchResult] = useState();
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [groupName, setGroupName] = useState();
  const [groupAvatar, setGroupAvatar] = useState();
  const api = `https://api.multiavatar.com/4645646`;
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserData();
    fetchData();
  }, []);

  const getUserData = async () => {
    try {
      const resp = await axios.get(
        `${BACKEND_LINK}/auth/getUser/${currentUser._id}`
      );
      setGroups(resp.data.user.group);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await Promise.all(
        Array.from({ length: 4 }, async () => {
          const response = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`,
            { responseType: "arraybuffer" }
          );
          const imageBuffer = Buffer.from(response.data, "binary");
          return `data:image/svg+xml;base64,${imageBuffer.toString("base64")}`;
        })
      );
      setAvatars(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleGroupClick = (group) => {
    setCurrentGroupChat(group);
  };

  const searchUserHandler = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios(`${BACKEND_LINK}/group/search?q=${search}`);
      const searchData = resp.data.filter(
        (search) => !groups.some((grp) => grp.name === search.name)
      );
      setSearchResult(searchData);
      setSearchActive(true);
    } catch (error) {
      console.error("Error while searching users:", error);
    }
  };

  const createNewGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_LINK}/group/createGroup`, {
        name: groupName,
        admin: currentUser._id,
        avatar: avatars[groupAvatar],
      });
      getUserData();
      setAddGrpPopup(false);
      setGroupName("");
      setGroupAvatar();
    } catch (error) {
      toast.error("Error Creating Group");
      console.error("Error Creating Group: ", error);
    }
  };

  const joinGroupHandler = async (id) => {
    try {
      await axios.post(`${BACKEND_LINK}/group/${id}/members`, {
        userId: currentUser._id,
      });
      getUserData();
      setSearch("");
      setSearchActive(false);
      setSearchResult();
    } catch (error) {
      console.error("Error while joining group:", error);
    }
  };

  return (
    <>
      {addGrpPopup && (
        <div className="flex justify-center items-center w-full h-[100vh] backdrop-blur absolute z-10 top-0">
          <div className="w-[40%] bg-[#1b2028] rounded-xl border-purple-500 border max-h-[80vh] overflow-hidden">
            <button
              className="p-3 block ml-auto m-1"
              onClick={() => setAddGrpPopup(false)}
            >
              <LuX className="text-white" size={22} />
            </button>
            <form className="flex justify-center items-center flex-col w-[80%] mx-auto mb-5">
              <label htmlFor="grpname" className="text-white text-xl mb-2">
                Enter Group Name
              </label>
              <input
                type="text"
                id="grpname"
                className="p-2 outline-none rounded-xl w-full text-center"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
              />
              {!isLoading && (
                <div className="flex justify-center items-center w-full mt-3 gap-x-2">
                  {avatars.map((avatar, index) => (
                    <div
                      key={index}
                      className={`avatar rounded-full p-2 border-4 w-24 h-24 cursor-pointer flex justify-center items-center ${
                        groupAvatar === index
                          ? "border-purple-500"
                          : "border-transparent"
                      }`}
                      onClick={() => setGroupAvatar(index)}
                    >
                      <img src={avatar} alt="avatar" className="w-24 h-24" />
                    </div>
                  ))}
                </div>
              )}
              <button
                className="mt-4 bg-purple-500 w-full p-2 rounded-xl"
                onClick={createNewGroup}
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      )}
      <form
        className="mt-3 mx-auto flex justify-center items-center w-[95%] rounded-full bg-[#1b2028] border-[#75767780]"
        onSubmit={searchUserHandler}
      >
        <input
          type="text"
          className="px-4 py-2 text-white bg-transparent w-full rounded-full outline-none"
          placeholder="Enter Group Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {searchResult ? (
          <LuX
            className="mr-3 text-2xl text-white/80 cursor-pointer"
            onClick={() => {
              setSearch("");
              setSearchActive(false);
              setSearchResult();
            }}
          />
        ) : (
          <BiSearch
            className="mr-3 text-2xl text-white/80 cursor-pointer"
            type="submit"
            onClick={searchUserHandler}
          />
        )}
        <IoAdd
          className="mr-3 text-2xl text-white/80 cursor-pointer"
          onClick={() => setAddGrpPopup(true)}
        />
      </form>
      {search && searchResult && searchActive && (
        <div className="flex flex-col w-full items-center overflow-auto gap-2 flex-grow pt-4">
          <p className="text-gray-500 text-left w-[90%]">Search Results: </p>
          {searchResult.map((group, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 cursor-pointer w-[95%] bg-[#242930] rounded p-3 transition duration-500 ease-in-out"
              onClick={() => joinGroupHandler(group._id)}
            >
              <div className="flex justify-center items-center">
                <img
                  src={`${group.avatar}`}
                  alt="avatar"
                  className="h-10 mr-2"
                />
                <p className="text-white text-lg">{group.name}</p>
              </div>
              <IoPersonAddOutline className="text-white" size={20} />
            </div>
          ))}
        </div>
      )}
      {!searchActive && (
        <div className="flex flex-col w-full items-center overflow-auto gap-2 flex-grow pt-4">
          {groups.map((group) => (
            <div
              key={group._id}
              className={`flex items-center gap-4 cursor-pointer w-[95%] bg-[#242930] rounded p-3 transition duration-500 ease-in-out`}
              onClick={() => handleGroupClick(group)}
            >
              <div>
                <img src={group.avatar} alt="avatar" className="h-10" />
              </div>
              <p className="text-white text-lg">{group.name}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default GroupList;
