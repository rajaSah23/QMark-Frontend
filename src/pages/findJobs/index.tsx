import JobCard from "../../components/cards/JobCard"
import ToolBar from "./ToolBar"

const FindJobs = () => {
  const arrs =[];
  for (let i = 1; i <= 50; i++) {
    const Component = () => <JobCard/>
    arrs.push(Component);
  }
   
  return (
    <div className="bg-mine-shaft-950">
      <ToolBar/>

     <div className="flex flex-wrap gap-10 justify-center items-center p-4">
     {arrs.map((a,idx)=>{
        return <JobCard key={idx}/>
      })}
     </div>
    </div>
  )
}

export default FindJobs