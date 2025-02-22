
const HowItWorks = () => {
    return (
        <div className="flex flex-col justify-around items-center  pt-16 text-white">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className=' text-4xl font-bold'>How it <span className="text-bright-sun-400">Works</span></div>
                <div>Effortlessly navigate through the process and land your dream job.
                </div>
            </div>
            <div className="flex  justify-around items-center w-full  pt-10 text-white">
                <div className="flex justify-center items-center">
                    <div className='w-[30rem] ' >
                        <img className="scale-x-[-1]" src="/public/man-with-laptop.png" alt="character" />
                    </div>
                </div>
                <div className="flex flex-col justify-center items-start ">
                    <div className="  p-4 flex justify-center items-center gap-3">
                        <div className=" p-2 rounded-full bg-bright-sun-400"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-file-cv"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M11 12.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0" /><path d="M13 11l1.5 6l1.5 -6" /></svg></div>
                        <div className=" flex flex-col justify-center items-start p-4">
                            <div className="text-lg font-bold text-mine-shaft-200">Build Your Resume</div>
                            <div className="text-mine-shaft-300">Create a standout resume with your skills.
                            </div>
                        </div>
                    </div>
                    <div className="  p-4 flex justify-center items-center gap-3">
                        <div className=" p-2 rounded-full bg-bright-sun-400">
                           
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-briefcase"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /><path d="M12 12l0 .01" /><path d="M3 13a20 20 0 0 0 18 0" /></svg>
                        </div>


                        <div className=" flex flex-col justify-center items-start p-4">
                            <div className="text-lg font-bold text-mine-shaft-200">Apply for Job</div>
                            <div className="text-mine-shaft-300">Find and apply for jobs that match your skills.

                            </div>
                        </div>
                    </div>
                    <div className="  p-4 flex justify-center items-center gap-3">
                        <div className=" p-2 rounded-full bg-bright-sun-400">
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-heart-handshake"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /><path d="M12 6l-3.293 3.293a1 1 0 0 0 0 1.414l.543 .543c.69 .69 1.81 .69 2.5 0l1 -1a3.182 3.182 0 0 1 4.5 0l2.25 2.25" /><path d="M12.5 15.5l2 2" /><path d="M15 13l2 2" /></svg>
                            </div>
                        <div className=" flex flex-col justify-center items-start p-4">
                            <div className="text-lg font-bold text-mine-shaft-200">Get Hired</div>
                            <div className="text-mine-shaft-300">Connect with employers and start your new job.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks