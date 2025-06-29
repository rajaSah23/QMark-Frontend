import { Button } from "@mantine/core";
import { getUserData } from "../../../utils/Utility";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const ViewProfile = () => {
  // const userdata = getUserData();
  const navigate = useNavigate()

  const {userData, loading } = useSelector((store: any) => store.user)

  const handleLogOut = () => {
    localStorage.clear();

    // ✅ Dispatch custom event so the same-tab component updates
    window.dispatchEvent(new Event("local-storage")); // trigger same-tab update
    navigate("/")

  };

  return (
    <div className="min-h-screen bg-mine-shaft-950 p-6">
      <div className="mx-auto rounded-md p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center md:flex-row md:items-center">
          <div className="w-24 h-24 bg-bright-sun-500 rounded-full flex items-center justify-center text-mine-shaft-900 text-3xl font-bold hover:cursor-pointer">
            {userData?.name?.toString().toUpperCase()?.charAt(0)}
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <h1 className="text-2xl font-bold text-bright-sun-50">{userData?.name}</h1>
            <p className="text-mine-shaft-300">{userData?.email}</p>
          </div>
        </div>

        <Button onClick={() => handleLogOut()}>LogOut</Button>

        {/* About Me Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-bright-sun-50">About Me</h2>
          <p className="mt-2 text-mine-shaft-300">
            I'm currently preparing for competitive exams like SSC and UPSC. I use this platform daily to practice and collect tricky MCQs that help sharpen my concepts and revision strategy.
          </p>
        </div>

        {/* Saved MCQs Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-bright-sun-50">Saved Questions</h2>
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-semibold text-bright-sun-50">
                Which layer of the OSI model is responsible for routing?
              </h3>
              <p className="text-sm text-mine-shaft-400">Saved under: Computer Networks</p>
            </div>
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-semibold text-bright-sun-50">
                What is the Big-O time complexity of binary search?
              </h3>
              <p className="text-sm text-mine-shaft-400">Saved under: Algorithms</p>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-bright-sun-50">Daily Activity Summary</h2>
          <ul className="mt-4 space-y-2 text-mine-shaft-300 list-disc list-inside">
            <li>
              <span className="text-bright-sun-400 font-semibold">MCQs Practiced:</span> 102 today
            </li>
            <li>
              <span className="text-bright-sun-400 font-semibold">MCQs Saved:</span> 4 tricky ones
            </li>
            <li>
              <span className="text-bright-sun-400 font-semibold">Subjects Covered:</span> Polity, Reasoning
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-bright-sun-500 text-mine-shaft-900 font-semibold rounded-md hover:bg-bright-sun-400 hover:cursor-pointer transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
