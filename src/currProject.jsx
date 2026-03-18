import { useNavigate, useParams} from "react-router-dom";
import { useFetch } from "./useFetch";
import Navbar from "./navbar";
import CalcDueDate from "./calcDueDate";
import { ArrowRightIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import TaskModal from "./addTask";
import { useState, useEffect } from "react";

const CurrProject = () => {
    const {id} = useParams()

    const {data: projData, error: projError} = useFetch("https://project-pulse-backend-plum.vercel.app/projects")
    const {data: taskData, error: taskError, refetch: taskRefetch} = useFetch("https://project-pulse-backend-plum.vercel.app/tasks")
    const {data: userData, error: userError} = useFetch("https://project-pulse-backend-plum.vercel.app/users")

    const selectedProj = projData?.filter(proj => proj._id === id)
    const projTasks = taskData?.filter(task => task.project && task.project._id === id)

    
    const navigate = useNavigate()

    const [filterValue, setFilterValue] = useState({
        priority: "",
        date: "",
        owner: ""
    })
    const [filterData, setFilterData] = useState([])

    function handleFilter(e){
        const {name, value} = e.target;
        if(name === "priority"){
            setFilterValue(prev => ({...prev, [name]: value}))
            setFilterValue(prev => ({...prev, date: ""}))
        }
        else if(name === "date"){
            setFilterValue(prev => ({...prev, [name]: value}))
            setFilterValue(prev => ({...prev, priority: ""}))
        }else if(name === "owner"){
            setFilterValue(prev => ({...prev, [name]: value}))
        }
    }

    useEffect(() => {
        if(projTasks){
            let filteredData = [...projTasks]
            const priorityOrder = {"Low": 0, "Medium": 1, "High": 2}
            if(filterValue.priority === "LtH"){
                filteredData = filteredData.sort((a,b) => priorityOrder[a.priority] - priorityOrder[b.priority])
            }else if(filterValue.priority === "HtL"){
                filteredData = filteredData.sort((a,b) => priorityOrder[b.priority] - priorityOrder[a.priority])
            }else if(filterValue.date === "NtO"){
                filteredData = filteredData.sort((a,b) => new Date(CalcDueDate(a.timeToComplete, a.createdAt)) - new Date(CalcDueDate(b.timeToComplete, b.createdAt)))
            }else if(filterValue.date === "OtN"){
                filteredData = filteredData.sort((a,b) => new Date(CalcDueDate(b.timeToComplete, b.createdAt)) - new Date(CalcDueDate(a.timeToComplete, a.createdAt)))
            }

            if(filterValue.owner){
                filteredData = filteredData.filter(task => task.owners.filter(owner => owner._id === filterValue.owner).length !== 0)
            }

            setFilterData(filteredData)
        }
    },[filterValue,taskData])

    
    return (
        <div className="row">
            <TaskModal id={id} onSuccess={taskRefetch}/>
            <Navbar page={"project"}/>
            <div className="col-10">
                {projData && taskData && userData
                ?
                <div>
                    <div style={{margin: "2rem 2rem"}}>
                        {selectedProj?.map(proj => (
                            <div>
                                <h3>{proj.name}</h3>
                                <div className="text-secondary">
                                    {proj.description}
                                </div>
                            </div> 
                        ))}
                    </div>
                    {filterData.length !== 0
                    ?
                    <div className="body">
                        <div className="filterOptions mb-3">
                            <div>
                                <div className="mx-3 fs-5">
                                    Sort by :
                                </div>
                                <div className="priorityBtn">
                                    <button className="rounded-pill filterBtn mx-1 px-3 py-1" name="priority" value="LtH" onClick={(e) => handleFilter(e)}>
                                        Priority Low-High
                                    </button>
                                    <button className="rounded-pill filterBtn mx-1 px-3 py-1" name="priority" value="HtL" onClick={(e) => handleFilter(e)}>
                                        Priority High-Low
                                    </button>
                                    <button className="rounded-pill filterBtn mx-1 px-3 py-1" name="date" value={"NtO"} onClick={(e) => handleFilter(e)}>
                                        Newest First
                                    </button>
                                    <button className="rounded-pill filterBtn mx-1 px-3 py-1" name="date" value={"OtN"} onClick={(e) => handleFilter(e)}>
                                        Oldest First
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <select name="owner" className="mx-3 form-select" value={filterValue.owner} onChange={handleFilter} >
                                        <option value="">Filter By Owner</option>
                                        {userData?.map(user => (
                                            <option value={user._id}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                    <button style={{background: "#2F3E8F", color: "#fff"}} className="btn btn px-2 py-1" data-bs-toggle="modal" data-bs-target="#taskModal"><PlusIcon size={20}/> New Task</button>
                                </div>
                            </div>
                        </div>
                        <div className="taskTable">
                            <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">TASKS</th>
                                <th scope="col">OWNER</th>
                                <th scope="col">PRIORITY</th>
                                <th scope="col">DUE ON</th>
                                <th scope="col">STATUS</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterData?.map(task => (
                                    <tr>
                                    <td>{task.name}</td>
                                    <td>{task.owners.map(owner => owner.name).join(", ")}</td>
                                    <td>{task.priority}</td>
                                    <td>{CalcDueDate(task.timeToComplete, task.createdAt)}</td>
                                    <td>{task.status}</td>
                                    <td><ArrowRightIcon className="taskArrow" onClick={() => navigate(`/projects/task/${task._id}`)}/></td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    <p className="fs-5 my-4 text-center"><em>"Tasks are not added to this project yet."</em></p>
                    } 
                </div>
                :
            <p className="text-center text-secondary fs-5 mt-4">Loading...</p>
            }   
            </div> 
        </div>
    )
}

export default CurrProject;