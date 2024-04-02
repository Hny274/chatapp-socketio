import React, { useEffect, useState } from "react";
import axios from "axios";
import { addFriendRoute } from "../utils/APIRoutes";

const GroupList = ({ currentUser, setCurrentGroupChat, currentGroupChat }) => {
  const [groups, setGroups] = useState([]);
  const [currentSelected, setCurrentSelected] = useState(null);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const resp = await axios.get(
        `${addFriendRoute}getUser/${currentUser._id}`
      );
      setGroups(resp.data.user.group);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleGroupClick = (group) => {
    setCurrentGroupChat(group);
    setCurrentSelected(group);
  };

  return (
    <div className="flex flex-col w-full items-center overflow-auto gap-2 flex-grow pt-4">
      {groups.map((group) => (
        <div
          key={group._id}
          className={`flex items-center gap-4 cursor-pointer w-[95%] bg-[#242930] rounded p-3 transition duration-500 ease-in-out ${
            group._id === currentSelected?._id ? "bg-purple-600" : ""
          }`}
          onClick={() => handleGroupClick(group)}
        >
          <div>
            <img src={group.avatar} alt="avatar" className="h-10" />
          </div>
          <p className="text-white text-lg">{group.name}</p>
        </div>
      ))}
    </div>
  );
};

export default GroupList;
