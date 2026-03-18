import ProjectModal from "./addProject";
import { useFetch } from "./useFetch";
import { PlusIcon } from "lucide-react";
import TaskModal from "./addTask";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import CalcDueDate from "./calcDueDate";
import { use, useEffect, useState } from "react";

const Dashboard = () => {

    const {data, error, refetch: projectRefetch} = useFetch("http://localhost:3000/projects")
    const {data: taskData, error: taskError, refetch: taskRefetch} = useFetch("http://localhost:3000/tasks")

    const navigate = useNavigate()

    const [filterData, setFilterData] = useState([])
    const [filterValue, setFilterValue] = useState("")
    
    const [projectFilterData, setProjectFilterData] = useState([])
    const [projectFilterValue, setProjectFilterValue] = useState("")

    function handleFilter(e){
        const {value} = e.target;    
        setFilterValue(value)
    }

    function handleProjectFilter(e){
        const {value} = e.target;
        setProjectFilterValue(value)
    }

    function getProjStatus(projId){
        let projStatus = ""
        if(taskData){
            taskData.filter(task => task.project && task.project._id === projId && task.status !== "Completed").length === 0
            ?
            projStatus = "Completed"
            :
            projStatus = "In progress"
        }
        return projStatus
    }


    useEffect(() => {
        if(!projectFilterValue){
            setProjectFilterData(data)
        }else if(projectFilterValue !== "Completed"){
            setProjectFilterData(data?.filter(proj => {
                if(getProjStatus(proj._id) !== "Completed"){
                    return proj
                }
            }))
        }else{
            setProjectFilterData(data?.filter(proj => {
                if(getProjStatus(proj._id) === "Completed"){
                    return proj
                }
            }))
        }
    },[projectFilterValue, data])


    useEffect(() => {
        if(!filterValue){
            setFilterData(taskData)
        }
        else if(filterValue !== "Completed"){
            setFilterData(taskData?.filter(task => task.status !== "Completed"))
        }else{
            setFilterData(taskData?.filter(task => task.status === "Completed"))
        }
    },[filterValue,taskData])


    return (
        <div className="row">
        <ProjectModal onSuccess={projectRefetch}/>
        <TaskModal onSuccess={taskRefetch}/>
        <Navbar page={"dashboard"}/>
        {data && taskData
        ?
        <div className="col-10">
            <div className="row searchBar" style={{margin: "1.7rem 2rem"}}>
                <div className="col-11 p-0">
                    <input type="text" className="searchInput" placeholder="    Search"/>
                </div>
                <div className="col-1 p-0">
                    <div className="searchIcon">
                        < Search color="#fff"/>
                    </div>
                </div>
            </div>
            <div className="body">
            <div className="dbHeadings">
                <div style={{display:"flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="fs-2 fw-semibold">Projects</div>
                    <div>
                    <select value={projectFilterValue} onChange={handleProjectFilter} className="form-select ms-3">
                        <option value="">Filter By Status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    </div>
                </div>
                
                <div className="d-flex justify-content-center align-items-center">
                    <button style={{background: "#2F3E8F", color: "#fff"}} className="btn btn px-2 py-1" data-bs-toggle="modal" data-bs-target="#projectModal"><PlusIcon size={20}/> New Project</button>
                </div>
            </div>
            <div className="projList mt-4">
                <div class="row">
                    {projectFilterData?.map(proj => (
                        <div class="col-4 mb-4">
                            <div class="card projCard" onClick={() => navigate(`/projects/${proj._id}`)} style={{background: "#F4F6F9", border: "none", height: "100%"}}>
                            <div class="card-body">
                                {getProjStatus(proj._id) !== "Completed" ? <span className="tagPill">In Progress</span> : <span className="tagPillSuccess">Completed</span>}
                                <h5 class="card-title text-truncate mt-2">{proj.name}</h5>
                                {proj.description !== "" ? <p class="card-text multi-line-truncate">{proj.description} </p> : <p className="text-center text-secondary mt-3">"Description is not provided"</p>}   
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="dbHeadings">
                <div style={{display:"flex", justifyContent: "center", alignItems: "center"}}>
                    <div className="fs-2 fw-semibold">My Tasks</div>
                    <div>
                    <select value={filterValue} onChange={handleFilter} className="form-select ms-3">
                        <option value="">Filter By Status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <button style={{background: "#2F3E8F", color: "#fff"}} className="btn btn px-2 py-1" data-bs-toggle="modal" data-bs-target="#taskModal"><PlusIcon size={20}/> New Task</button>
                </div>
            </div>
            <div className="projList mt-4">
                <div class="row">
                    {filterData?.map(task => (
                        <div class="col-4 mb-3">
                            <div class="card" style={{background: "#F4F6F9", border: "none", height: "100%", cursor: "pointer"}} onClick={() => navigate(`/projects/task/${task._id}`)}>
                            <div class="card-body">
                                {task.status !== "Completed" ? <span className="tagPill">{task.status}</span> : <span className="tagPillSuccess">{task.status}</span>}
                                <h5 class="card-title mt-2 text-truncate">{task.name}</h5>
                                <div class="card-text text-secondary my-2" style={{fontWeight: "bolder"}}>Due on: {CalcDueDate(task.timeToComplete, task.createdAt)}</div>   
                                {task.owners.length > 1 
                                ?
                                <div className="text-secondary">{task.owners[0].name}...+{task.owners.length - 1} more</div>
                                :
                                <div className="text-secondary">{task.owners[0].name}</div>
                                }  
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
        :
        <p className="text-center text-secondary fs-5 mt-4">Loading...</p>
        }    
        </div>
    )
}

export default Dashboard;