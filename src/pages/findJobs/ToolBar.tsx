import { IconBriefcase, IconCategory, IconLocation, IconSearch } from "@tabler/icons-react"
import MultiSelectSearch from "../../components/searchBox/MultiSelectSearch"

const ToolBar = () => {
    return (
        <div className=" flex  justify-between px-4 items-center w-full">
            <div className=" p-2 flex gap-2 items-center  min-w-[200px] w-full">
                <IconSearch className="text-bright-sun-400"/>
                <MultiSelectSearch placeholder="Job Title"/>
            </div>
            <div className=" p-2 flex gap-2 items-center min-w-[200px]  w-full">
                <IconLocation className="text-bright-sun-400"/>
                <MultiSelectSearch  placeholder="Noida"/>
            </div>
            <div className=" p-2 flex gap-2 items-center  w-full">
                <IconBriefcase className="text-bright-sun-400"/>
                <MultiSelectSearch  placeholder="Experience"/>
            </div>
            <div className=" p-2 flex gap-2 items-center  w-full">
                <IconCategory className="text-bright-sun-400"/>
                <MultiSelectSearch  placeholder="Job Type"/>
            </div>
           
            
            

        </div>
    )
}

export default ToolBar