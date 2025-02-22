import { Link, useLocation } from 'react-router-dom'

const NavLinks = () => {
    const location = useLocation();
    const links = [
        { name: "Dashboard", url: "" },
        { name: "Questions", url: "questions" },
        { name: "Upload Job", url: "job-upload" },
        { name: "About us", url: "about" },
    ]

    
    return (
        <div className=" flex gap-3 justify-center items-center">
            {links.map((navLink, idx) => <Link key={idx} to={"/"+navLink.url} className={`${location.pathname =="/"+navLink.url ? "text-bright-sun-400 border-t-2" : "text-mine-shaft-400"} px-1  hover:text-bright-sun-400`} >{navLink.name}</Link>)}
        </div>
    )
}

export default NavLinks