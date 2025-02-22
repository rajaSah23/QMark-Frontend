import { useNavigate } from "react-router-dom";

const JobCard = () => {
    const navigate = useNavigate();
  return (
    <div className="max-w-sm p-4 bg-mine-shaft-900 rounded-2xl shadow-lg hover:shadow-md hover:shadow-bright-sun-400 hover:scale-103 transition-all hover:cursor-pointer" onClick={()=>navigate("/job-detail")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-bright-sun-500 rounded-full flex items-center justify-center">
            <span className="text-mine-shaft-900 text-xl font-bold">M</span>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-bright-sun-50">
              Product Designer
            </h2>
            <p className="text-sm text-mine-shaft-400">
              Microsoft • 58 Applicants
            </p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-mine-shaft-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-mine-shaft-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </div>
      <div className="mt-3">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-mine-shaft-700 text-bright-sun-400 text-sm rounded-full">
            Intermediate
          </span>
          <span className="px-3 py-1 bg-mine-shaft-700 text-bright-sun-400 text-sm rounded-full">
            Full-Time
          </span>
          <span className="px-3 py-1 bg-mine-shaft-700 text-bright-sun-400 text-sm rounded-full">
            Remote
          </span>
        </div>
        <p className="mt-3 text-sm text-mine-shaft-300">
          Join Microsoft as a Product Designer and contribute to our new
          Lightspeed LA studio. We're looking for designers who...
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-bold text-bright-sun-400">₹35 LPA</p>
        <p className="text-sm text-mine-shaft-400">Posted 4 days ago</p>
      </div>
    </div>
  );
};

export default JobCard;
