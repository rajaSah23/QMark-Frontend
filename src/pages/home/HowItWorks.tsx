const HowItWorks = () => {
    return (
        <div className="flex flex-col items-center pt-16 text-white px-4 md:px-12">
            {/* Heading */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">
                    How it <span className="text-bright-sun-400">Works</span>
                </h2>
                <p className="text-mine-shaft-300 max-w-xl">
                    A smarter way to master tricky MCQs — save, sort, and revise with ease.
                </p>
            </div>

            {/* Content Section */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full pt-10 gap-10">
                {/* Left: Image */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img src="/public/man-with-laptop.png" alt="character" className="w-full max-w-md scale-x-[-1]" />
                </div>
                {/* Right: Steps */}
                <div className="flex flex-col justify-center items-start gap-6 w-full md:w-1/2">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-bright-sun-400 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 5v16l7 -5l7 5v-16z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-mine-shaft-200">Save Tricky MCQs</h4>
                            <p className="text-mine-shaft-300">Bookmark tough or important questions for quick access later.</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-bright-sun-400 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 6h4l2 3h8a1 1 0 0 1 1 1v2h-17v-4a2 2 0 0 1 2 -2" />
                                <path d="M3 13h18v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-4" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-mine-shaft-200">Organize by Topic</h4>
                            <p className="text-mine-shaft-300">Sort saved questions by subject or topic to stay organized.</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-bright-sun-400 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M3.5 9a9 9 0 1 1 3 7.5" />
                                <path d="M3 4.5v4h4" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-mine-shaft-200">Revise Anytime</h4>
                            <p className="text-mine-shaft-300">Access your saved questions whenever you want and practice repeatedly.</p>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default HowItWorks;
