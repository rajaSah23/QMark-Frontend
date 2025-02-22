
const AboutUs = () => {
  return (
    <div className=" min-h-screen text-bright-sun-50 p-6">
      <div className="mx-auto p-6 bg-mine-shaft-950 rounded-md shadow-lg">
        {/* Header Section */}
        <h1 className="text-4xl font-extrabold mb-6 text-center text-bright-sun-50">
          About Us
        </h1>
        <p className="text-mine-shaft-300 text-center mb-8">
          At our core, we are a dynamic team passionate about revolutionizing the job market. 
          Our goal is to connect ambitious individuals with incredible career opportunities, 
          leveraging cutting-edge technology to make the process seamless and transparent.
        </p>

        {/* Core Values Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-bright-sun-50 mb-4">Our Core Values</h2>
          <ul className="list-disc list-inside space-y-2 text-mine-shaft-300">
            <li>
              <span className="text-bright-sun-400 font-semibold">Innovation:</span> 
              Always exploring new ways to deliver the best experience.
            </li>
            <li>
              <span className="text-bright-sun-400 font-semibold">Transparency:</span> 
              Ensuring open communication between job seekers and employers.
            </li>
            <li>
              <span className="text-bright-sun-400 font-semibold">Diversity:</span> 
              Fostering inclusivity by embracing talent from all walks of life.
            </li>
            <li>
              <span className="text-bright-sun-400 font-semibold">Excellence:</span> 
              Striving for the highest standards in everything we do.
            </li>
          </ul>
        </div>

        {/* Our Journey Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-bright-sun-50 mb-4">Our Journey</h2>
          <p className="text-mine-shaft-300 mb-4">
            What started as a small idea to simplify job applications has grown into a global platform 
            trusted by thousands of professionals and businesses. Over the years, we've achieved milestones 
            that reflect our dedication to transforming how people connect with their dream jobs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Milestone Cards */}
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-bold text-bright-sun-50 mb-2">2019</h3>
              <p className="text-mine-shaft-300">
                Launched our platform with a mission to simplify recruitment processes.
              </p>
            </div>
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-bold text-bright-sun-50 mb-2">2021</h3>
              <p className="text-mine-shaft-300">
                Achieved 1 million job applications processed across industries.
              </p>
            </div>
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-bold text-bright-sun-50 mb-2">2024</h3>
              <p className="text-mine-shaft-300">
                Partnered with top global companies to bring exciting opportunities to job seekers.
              </p>
            </div>
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-bright-sun-50 mb-4">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Team Member Cards */}
            <div className="text-center p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <div className="w-20 h-20 mx-auto bg-bright-sun-400 rounded-full mb-3"></div>
              <h3 className="text-lg font-bold text-bright-sun-50">Jane Doe</h3>
              <p className="text-mine-shaft-300">CEO & Founder</p>
            </div>
            <div className="text-center p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <div className="w-20 h-20 mx-auto bg-bright-sun-400 rounded-full mb-3"></div>
              <h3 className="text-lg font-bold text-bright-sun-50">John Smith</h3>
              <p className="text-mine-shaft-300">Head of Technology</p>
            </div>
            <div className="text-center p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <div className="w-20 h-20 mx-auto bg-bright-sun-400 rounded-full mb-3"></div>
              <h3 className="text-lg font-bold text-bright-sun-50">Alice Brown</h3>
              <p className="text-mine-shaft-300">Design Lead</p>
            </div>
            <div className="text-center p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <div className="w-20 h-20 mx-auto bg-bright-sun-400 rounded-full mb-3"></div>
              <h3 className="text-lg font-bold text-bright-sun-50">Robert White</h3>
              <p className="text-mine-shaft-300">Marketing Manager</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10">
          <h3 className="text-2xl font-bold text-bright-sun-50 mb-4">
            Ready to Join Us?
          </h3>
          <button className="px-6 py-2 bg-bright-sun-500 text-mine-shaft-900 font-semibold rounded-md hover:bg-bright-sun-400 focus:ring-2 focus:ring-bright-sun-500 hover:cursor-pointer">
            Explore Opportunities
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
