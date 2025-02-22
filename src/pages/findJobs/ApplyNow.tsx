import { useState } from "react";

const ApplyNowForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    resume: null,
    coverLetter: "",
  });

  const handleChange = (e:any) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Application submitted successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-mine-shaft-950 rounded-md my-4 shadow-lg">
      <h2 className="text-2xl font-bold text-bright-sun-50">Apply Now</h2>
      <p className="mt-2 text-mine-shaft-400">
        Fill out the form below to apply for the position.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm text-bright-sun-400 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-mine-shaft-800 text-bright-sun-50 rounded-lg focus:ring-2 focus:ring-bright-sun-500 outline-none"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm text-bright-sun-400 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-mine-shaft-800 text-bright-sun-50 rounded-lg focus:ring-2 focus:ring-bright-sun-500 outline-none"
            placeholder="Enter your email address"
          />
        </div>

        {/* Resume Upload */}
        <div>
          <label
            htmlFor="resume"
            className="block text-sm text-bright-sun-400 mb-1"
          >
            Resume
          </label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleChange}
            required
            className="w-full text-mine-shaft-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-bright-sun-500 file:text-mine-shaft-900 hover:file:bg-bright-sun-400"
            accept=".pdf,.doc,.docx"
          />
        </div>

        {/* Cover Letter */}
        <div>
          <label
            htmlFor="coverLetter"
            className="block text-sm text-bright-sun-400 mb-1"
          >
            Cover Letter (Optional)
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 bg-mine-shaft-800 text-bright-sun-50 rounded-lg focus:ring-2 focus:ring-bright-sun-500 outline-none"
            placeholder="Write a brief cover letter (optional)"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-bright-sun-500 text-mine-shaft-900 font-semibold rounded-lg hover:bg-bright-sun-400 focus:ring-2 focus:ring-bright-sun-500"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyNowForm;
