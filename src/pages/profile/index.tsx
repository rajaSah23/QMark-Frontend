import React from "react";

const ViewProfile = () => {
  return (
    <div className="min-h-screen bg-mine-shaft-950 p-6">
      <div className="mx-auto  rounded-md  p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center md:flex-row md:items-center">
          <div className="w-24 h-24 bg-bright-sun-500 rounded-full flex items-center justify-center text-mine-shaft-900 text-3xl font-bold hover:cursor-pointer">
            A
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <h1 className="text-2xl font-bold text-bright-sun-50">Alice Johnson</h1>
            <p className="text-mine-shaft-300">alice@example.com</p>
          </div>
        </div>

        {/* About Me Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-bright-sun-50">About Me</h2>
          <p className="mt-2 text-mine-shaft-300">
            I'm a passionate professional actively pursuing opportunities in product design. With a keen eye for detail and a strong background in user-centric design, I'm excited to contribute to innovative projects and further my career.
          </p>
        </div>

        {/* Applied Jobs Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-bright-sun-50">Applied Jobs</h2>
          <div className="mt-4 space-y-4">
            {/* Applied Job Card 1 */}
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-semibold text-bright-sun-50">
                Product Designer at Microsoft
              </h3>
              <p className="text-sm text-mine-shaft-400">Applied on Feb 01, 2025</p>
            </div>
            {/* Applied Job Card 2 */}
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-semibold text-bright-sun-50">
                UI/UX Designer at Google
              </h3>
              <p className="text-sm text-mine-shaft-400">Applied on Jan 28, 2025</p>
            </div>
            {/* Additional applied job cards can be added here */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-bright-sun-500 text-mine-shaft-900 font-semibold rounded-md hover:bg-bright-sun-400 hover:cursor-pointer">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
