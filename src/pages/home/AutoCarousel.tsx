import Marquee from "react-fast-marquee";

const AutoCarousel = () => {
    const startupNames = [
        "Skybound Labs",
        "Quantum Nexus",
        "NovaSphere",
        "HyperCraft",
        "AeroLogic",
        "EcoFusion",
        "PixelHive",
        "BrightPath",
        "Solarion",
        "NeuralPeak",
        "CloudNova",
        "TechHaven",
        "SwiftMinds",
        "OrbitScale",
        "CoreVibe",
        "InnoBloom",
        "VividPulse",
        "StarForge",
        "BlueOrbit",
        "DigitalEcho",
        "AlphaArc",
        "MetaFlow",
        "PrismByte",
        "SmartSprout",
        "UrbanEvolve",
        "NextEra",
        "AquaCore",
        "LumenEdge",
        "TrailBlaze",
        "VisionaryGrid"
    ];

    return (
        <div className=" text-white flex flex-col justify-center items-center gap-10">
            <div className="text-3xl font-bold"> More than <span className='text-bright-sun-400'>10000 Questions</span></div>

            <Marquee pauseOnHover={true} >
                <div className=" flex gap-4">
                    {startupNames?.map((startUp) =>
                        <div className=" flex justify-start items-center  py-1 px-3 rounded-md bg-mine-shaft-900">
                            <div className=" h-16 w-20 p-0 flex justify-center items-center">
                                <img src="public/spotify-Logo.svg" alt="spotify" />
                            </div>
                            {startUp}
                        </div>)}
                </div>

            </Marquee>
        </div>
    )
}

export default AutoCarousel