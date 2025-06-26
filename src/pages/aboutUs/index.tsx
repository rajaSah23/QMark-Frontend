const AboutUs = () => {
  return (
    <div className="min-h-screen text-bright-sun-50 p-6">
      <div className="mx-auto p-6 bg-mine-shaft-950 rounded-md shadow-lg">
        {/* Header Section */}
        <h1 className="text-4xl font-extrabold mb-6 text-center text-bright-sun-50">
          About Us
        </h1>
        <p className="text-mine-shaft-300 text-center mb-8">
          We're a passionate team on a mission to empower competitive exam aspirants by solving one of their biggest pain points — storing and revising important and tricky MCQs. Our platform helps students easily mark, organize, and revisit questions that matter the most, making their preparation smarter and more focused.
        </p>

        {/* Core Values Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-bright-sun-50 mb-4">Our Core Values</h2>
          <ul className="list-disc list-inside space-y-2 text-mine-shaft-300">
            <li>
              <span className="text-bright-sun-400 font-semibold">Efficiency:</span>
              Helping students make the most out of their study time.
            </li>
            <li>
              <span className="text-bright-sun-400 font-semibold">Simplicity:</span>
              Making MCQ storage and revision effortless and user-friendly.
            </li>
            <li>
              <span className="text-bright-sun-400 font-semibold">Personalization:</span>
              Allowing students to track and revise based on their own strengths and weaknesses.
            </li>
            <li>
              <span className="text-bright-sun-400 font-semibold">Focus:</span>
              Encouraging students to concentrate on quality over quantity.
            </li>
          </ul>
        </div>

        {/* Our Journey Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-bright-sun-50 mb-4">Our Journey</h2>
          <p className="text-mine-shaft-300 mb-4">
            The idea started with a simple observation — students solve hundreds of MCQs daily, but often forget the few that truly challenge them. We built a platform where those important questions could be saved, sorted, and revisited with ease. Today, we’re growing into a trusted tool for students across the country who want to prepare smart, not just hard.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Milestone Cards */}
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-bold text-bright-sun-50 mb-2">2023</h3>
              <p className="text-mine-shaft-300">
                Conceptualized the idea after observing real challenges faced by students during MCQ preparation.
              </p>
            </div>
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-bold text-bright-sun-50 mb-2">2024</h3>
              <p className="text-mine-shaft-300">
                Launched the first version of the platform with bookmarking and topic-wise sorting features.
              </p>
            </div>
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-bold text-bright-sun-50 mb-2">2025</h3>
              <p className="text-mine-shaft-300">
                Gained a community of passionate learners and launched revision tracking and notes features.
              </p>
            </div>
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-bright-sun-50 mb-4">Meet the Team</h2>
          <div className="w-full py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
              {/* Team Member Cards */}
              <div className="text-center p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
                <div className="w-20 h-20 mx-auto bg-bright-sun-400 rounded-full mb-3"></div>
                <h3 className="text-lg font-bold text-bright-sun-50">Raja Kumar</h3>
                <p className="text-mine-shaft-300">Founder & Developer</p>
              </div>
              <div className="text-center p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
                <div className="w-20 h-20 mx-auto bg-bright-sun-400 rounded-full mb-3"></div>
                <h3 className="text-lg font-bold text-bright-sun-50">Santraj</h3>
                <p className="text-mine-shaft-300">UI/UX Designer</p>
              </div>
              <div className="text-center p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
                <div className="w-20 h-20 mx-auto bg-bright-sun-400 rounded-full mb-3"></div>
                <h3 className="text-lg font-bold text-bright-sun-50">Vikas Kumar</h3>
                <p className="text-mine-shaft-300">Backend Engineer</p>
              </div>
            </div>
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center mt-10">
          <h3 className="text-2xl font-bold text-bright-sun-50 mb-4">
            Want to make your preparation smarter?
          </h3>
          <button className="px-6 py-2 bg-bright-sun-500 text-mine-shaft-900 font-semibold rounded-md hover:bg-bright-sun-400 focus:ring-2 focus:ring-bright-sun-500 hover:cursor-pointer">
            Start Saving MCQs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
