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

    const {data, error, refetch: projectRefetch} = useFetch("https://project-pulse-backend-nine.vercel.app/projects")
    const {data: taskData, error: taskError, refetch: taskRefetch} = useFetch("https://project-pulse-backend-nine.vercel.app/tasks")

    const navigate = useNavigate()

    const [taskSearchData, setTaskSearchData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [filterValue, setFilterValue] = useState("")
    
    const [projSearchData, setProjSearchData] = useState([])
    const [projectFilterData, setProjectFilterData] = useState([])
    const [projectFilterValue, setProjectFilterValue] = useState("")

    const [searchValue, setSearchValue] = useState("")

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

    function handleSearch(e){
        const {value} = e.target;
        setSearchValue(value.toLowerCase())
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
        else if(filterValue === "To Do"){
            setFilterData(taskData?.filter(task => task.status === "To Do"))
        }else if(filterValue === "In Progress"){
            setFilterData(taskData?.filter(task => task.status === "In Progress"))
        }else{
            setFilterData(taskData?.filter(task => task.status === "Completed"))
        }
    },[filterValue,taskData])


    useEffect(() => {
        if(searchValue){
            setProjSearchData(projectFilterData.filter(project => project.name.toLowerCase().includes(searchValue)))
            setTaskSearchData(filterData.filter(task => task.name.toLowerCase().includes(searchValue)))
        }else{
            setProjSearchData(projectFilterData)
            setTaskSearchData(filterData)
        }
    },[projectFilterData, filterData, searchValue])


    return (
        <div className="dbFullScreen">
        <ProjectModal onSuccess={projectRefetch}/>
        <TaskModal onSuccess={taskRefetch}/>
        <div className="fixToTop">
            <Navbar page={"dashboard"}/>
            <div className="col-12 container my-3 d-lg-none">
                <input type="text" className="searchInput" placeholder="    Search" onChange={handleSearch}/>
            </div>
        </div>
        <div className="col-lg-9 col-xl-10 col-12">
            {data && taskData
            ?
            <div className="body">
                <div className="container">
                <div className="col-12 my-3 d-lg-block d-none searchBarLarge">
                    <input type="text" className="searchInput" placeholder="    Search" onChange={handleSearch}/>
                </div>
                <div>
                    <div className="dbHeadings">
                        <div className="fs-2 fw-semibold">Projects</div>
                        <div className="projOptions mt-2">
                            <div className="col-6 col-xl-4 pe-0">
                                <select value={projectFilterValue} onChange={handleProjectFilter} className="form-select py-2">
                                    <option value="">Filter By Status</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="d-flex justify-content-center align-items-center col-6 col-xl-4">
                                <button style={{background: "#2F3E8F", color: "#fff"}} className="btn btn px-lg-2 py-2 newProjBtn" data-bs-toggle="modal" data-bs-target="#projectModal"><PlusIcon size={20}/> New Project</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="projList mt-4">
                    <div class="row">
                        {projSearchData?.length !== 0
                        ?
                        projSearchData?.map(proj => (
                            <div class="col-xl-4 col-md-6 col-lg-6 col-12 mb-4">
                                <div class="card projCard" onClick={() => navigate(`/projects/${proj._id}`)} style={{background: "#F4F6F9", border: "none", height: "100%"}}>
                                <div class="card-body">
                                    {getProjStatus(proj._id) !== "Completed" ? <span className="tagPill">In Progress</span> : <span className="tagPillSuccess">Completed</span>}
                                    <h5 class="card-title text-truncate mt-2">{proj.name}</h5>
                                    {proj.description !== "" ? <p class="card-text multi-line-truncate" style={{textAlign: "justify"}}>{proj.description} </p> : <p className="text-center text-secondary mt-3">"Description is not provided"</p>}   
                                </div>
                                </div>
                            </div>
                        ))
                        :
                        <p className="text-center fs-5 my-5"><em>"Projects not found."</em></p>
                    }
                    </div>
                </div>
                <div className="dbHeadings">
                    <div className="fs-2 fw-semibold">My Tasks</div>
                    <div className="projOptions mt-2">
                        <div className="col-6 col-xl-4 pe-0">
                            <select value={filterValue} onChange={handleFilter} className="form-select py-2">
                                <option value="">Filter By Status</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-center align-items-center col-6 col-xl-4">
                            <button style={{background: "#2F3E8F", color: "#fff"}} className="btn btn px-lg-2 py-2 newTaskBtn" data-bs-toggle="modal" data-bs-target="#taskModal"><PlusIcon size={20}/> New Task</button>
                        </div>
                    </div>
                </div>
                <div className="projList mt-4">
                    <div class="row">
                        {taskSearchData?.length !== 0
                        ?
                        taskSearchData?.map(task => (
                            <div class="col-xl-4 col-md-6 col-lg-6 col-12 mb-3">
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
                        ))
                        :
                        <p className="text-center fs-5 my-5"><em>"Tasks not found."</em></p>
                    }
                    </div>
                </div>
                </div>
            </div>
            :
            <p className="text-center text-secondary fs-5 mt-4">Loading...</p>
            }
        </div>    
        </div>
    )
}

export default Dashboard;