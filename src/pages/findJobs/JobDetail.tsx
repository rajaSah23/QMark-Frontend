import { useNavigate } from "react-router-dom";

const JobDetail = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto p-6 bg-mine-shaft-950 rounded-md my-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-bright-sun-500 rounded-full flex items-center justify-center">
            <span className="text-mine-shaft-900 text-2xl font-bold">M</span>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-bright-sun-50">
              Product Designer
            </h1>
            <p className="text-sm text-mine-shaft-400">Microsoft</p>
          </div>
        </div>
        <button  onClick={()=>navigate("/job-apply")} className="px-4 py-2 bg-bright-sun-500 text-mine-shaft-900 font-semibold rounded-full hover:bg-bright-sun-400">
          Apply Now
        </button>
      </div>

      {/* Job Info */}
      <div className="mt-6">
        <div className="flex flex-wrap gap-4">
          <span className="px-4 py-2 bg-mine-shaft-700 text-bright-sun-400 text-sm rounded-full">
            Intermediate
          </span>
          <span className="px-4 py-2 bg-mine-shaft-700 text-bright-sun-400 text-sm rounded-full">
            Full-Time
          </span>
          <span className="px-4 py-2 bg-mine-shaft-700 text-bright-sun-400 text-sm rounded-full">
            Remote
          </span>
        </div>
        <p className="mt-4 text-sm text-mine-shaft-300">
          Join Microsoft as a Product Designer and contribute to our new
          Lightspeed LA studio. We're looking for designers who excel at
          creating user-centric designs and have a strong passion for
          innovation. You'll work closely with a diverse team to design
          products that impact millions of users globally.
        </p>
      </div>

      {/* Job Details */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-bright-sun-50">Job Details</h2>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-mine-shaft-300">
            <span className="font-semibold text-bright-sun-400">Location:</span>{" "}
            Remote
          </p>
          <p className="text-sm text-mine-shaft-300">
            <span className="font-semibold text-bright-sun-400">Experience:</span>{" "}
            3+ years
          </p>
          <p className="text-sm text-mine-shaft-300">
            <span className="font-semibold text-bright-sun-400">Salary:</span>{" "}
            ₹35 LPA
          </p>
          <p className="text-sm text-mine-shaft-300">
            <span className="font-semibold text-bright-sun-400">
              Posted Date:
            </span>{" "}
            4 days ago
          </p>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-bright-sun-50">
          Responsibilities
        </h2>
        <ul className="mt-4 list-disc list-inside space-y-2 text-mine-shaft-300">
          <li>Design user-friendly interfaces for web and mobile platforms.</li>
          <li>Collaborate with developers to implement your designs.</li>
          <li>Conduct user research to gather insights for design decisions.</li>
          <li>Stay updated with design trends and technologies.</li>
        </ul>
      </div>

      {/* Requirements */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-bright-sun-50">Requirements</h2>
        <ul className="mt-4 list-disc list-inside space-y-2 text-mine-shaft-300">
          <li>Proven experience in product design (3+ years).</li>
          <li>Proficiency in design tools like Figma or Adobe XD.</li>
          <li>Strong understanding of user experience principles.</li>
          <li>Excellent communication and teamwork skills.</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-between items-center">
        <p className="text-sm text-mine-shaft-400">
          <span className="font-semibold text-bright-sun-400">Microsoft</span>{" "}
          • Lightspeed LA Studio
        </p>
        <button onClick={()=>navigate("/job-apply")} className="px-4 py-2 bg-bright-sun-500 text-mine-shaft-900 font-semibold rounded-full hover:bg-bright-sun-400">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
