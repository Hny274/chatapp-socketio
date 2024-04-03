import React, { useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import { LuX } from "react-icons/lu";
import { MdClose, MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_LINK } from "../../utils/baseApi";

const GrpHeader = ({
  setCurrentGroupChat,
  currentGroupChat,
  groupData,
  currentUser,
  setTab,
}) => {
  const [showGrpDetails, setShowGrpDetails] = useState(false);

  const leaveGroupHandler = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to leave this group?"
      );
      if (!confirmed) return;

      await axios.delete(
        `${BACKEND_LINK}/group/${groupData._id}/members/${currentUser._id}`
      );

      setCurrentGroupChat(undefined);
      setTab(1);
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const deleteGroupHandler = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this group?"
      );
      if (!confirmed) return;

      await axios.delete(`${BACKEND_LINK}/group/deleteGroup/${groupData._id}`);
      setCurrentGroupChat(undefined);
      setTab(1);
      toast.success("Group Deleted!");
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    <>
      {showGrpDetails && (
        <div className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50">
          <div className="w-[45%] bg-[#1b2028] rounded-xl border border-purple-500 max-h-[60vh] overflow-hidden">
            <div className="flex items-center justify-between bg-[#75767740] rounded-t-xl p-3">
              <div className="flex items-center w-full">
                <img
                  src={currentGroupChat?.avatar}
                  alt="avatar"
                  className="h-10"
                />
                <p className="text-white text-xl ml-4">
                  {currentGroupChat?.name}
                </p>
              </div>
              <button className="p-2" onClick={() => setShowGrpDetails(false)}>
                <LuX className="text-white" size={22} />
              </button>
            </div>
            <div className="overflow-y-auto">
              <p className="text-[#757677] m-3 mb-1">Admin:</p>
              <div className="flex items-center justify-between rounded-t-xl p-3 cursor-pointer">
                <div className="flex items-center">
                  <img
                    src={groupData?.admin.avatarImage}
                    alt="avatar"
                    className="h-10"
                  />
                  <p className="text-white ml-4">{groupData?.admin.username}</p>
                </div>
                {groupData?.admin._id === currentUser._id && (
                  <button
                    className="ml-auto mr-2 p-2"
                    onClick={deleteGroupHandler}
                  >
                    <MdDeleteOutline className="text-red-500 text-xl" />
                  </button>
                )}
              </div>
              {groupData && groupData.users.length > 1 && (
                <p className="text-[#757677] m-3 mb-1">Group Members:</p>
              )}
              {groupData &&
                groupData.users.map((member) => {
                  if (member._id !== groupData.admin._id) {
                    return (
                      <div
                        className="flex items-center rounded-t-xl p-3 cursor-pointer"
                        key={member._id}
                      >
                        <img
                          src={member.avatarImage}
                          alt="avatar"
                          className="h-10"
                        />
                        <p className="text-white ml-4">{member.username}</p>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center pb-4 px-6 py-4 bg-[#1b2028] w-[72%] h-full relative border-b border-b-[#75767780] cursor-pointer">
        <div className="flex justify-center items-center">
          <img
            onClick={() => setShowGrpDetails(true)}
            src={currentGroupChat?.avatar}
            alt="avatar"
            className="h-10"
          />
          <div>
            <p
              className="text-white text-lg ml-4"
              onClick={() => setShowGrpDetails(true)}
            >
              {currentGroupChat?.name}
            </p>
            <p className="text-white/70 text-sm ml-4">
              {groupData &&
                groupData.users.map((item, index) => (
                  <span
                    key={item._id}
                    className={`${
                      item.username === groupData.admin.username &&
                      "text-purple-400"
                    }`}
                  >
                    {item.username}
                    {index + 1 !== groupData.users.length && ", "}
                  </span>
                ))}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          {groupData?.admin._id !== currentUser._id && (
            <button onClick={leaveGroupHandler}>
              <IoExitOutline
                size={22}
                className="text-gray-400 cursor-pointer mr-3"
              />
            </button>
          )}
          <button onClick={() => setCurrentGroupChat(undefined)}>
            <MdClose size={22} className="text-gray-400 cursor-pointer" />
          </button>
        </div>
      </div>
    </>
  );
};

export default GrpHeader;
