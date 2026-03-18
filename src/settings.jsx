import { useContext, useEffect, useState } from "react";
import Navbar from "./navbar";
import { currUser } from "./userContext";
import AuthenticateUser from "./authLogic";
import { useNavigate } from "react-router-dom";
import { useFetch } from "./useFetch";
import axios from "axios";
import { toast } from "react-toastify";

const Setting = () => {
    const {currUserInfo} = useContext(currUser)

    const {data: projData, refetch: projRefetch} = useFetch("https://project-pulse-backend-plum.vercel.app/projects")
    const {data: taskData, refetch: taskRefetch} = useFetch("https://project-pulse-backend-plum.vercel.app/tasks")

    const [currToken, setCurrToken] = useState(localStorage.getItem("token"))
    const navigate = useNavigate()

    AuthenticateUser({currToken}, "/setting")
    
    function handleLogout(){
        localStorage.removeItem("token")
        setCurrToken(localStorage.getItem("token"))
    }
 
    useEffect(() => {
        if(!currToken){
            navigate("/")
        }
    },[currToken])

    async function handleTaskDelete(taskId){
        try{
            const token = localStorage.getItem("token")

            const response = await axios.delete(`https://project-pulse-backend-plum.vercel.app/tasks/${taskId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response){
                toast.warning("Task Deleted!");
                taskRefetch()
            }
        }catch(error){
            console.log(error)
        }
    }

    async function handleProjDelete(projId){
        try{
            const token = localStorage.getItem("token")

            const response = await axios.delete(`https://project-pulse-backend-plum.vercel.app/projects/${projId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response){
                toast.warning("Project Deleted!");
                projRefetch()
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <div className="row">
                <Navbar page={"setting"}/>
                {taskData && projData
                ?
                <div className="col-10">
                    <div style={{margin: "2rem 2rem"}}>
                        <h2>User Profile</h2>
                    </div>
                    <div className="body fs-5">
                        <p><strong>User Name: </strong>{currUserInfo.name}</p>
                        <p><strong>User Email: </strong>{currUserInfo.email}</p>
                        <button style={{background: "#2F3E8F", color: "#fff"}} className="btn btn px-2 py-1" onClick={handleLogout}>Log Out</button>
                        <h2 className="my-4">Delete Projects & Tasks</h2>    
                        <div>
                            <div className="taskTable" style={{margin: "2rem 5rem"}}> 
                                <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col">Project Name</th>
                                    <th scope="col">Delete project</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projData?.map(proj => (
                                        <tr>
                                        <td>{proj.name}</td>
                                        <td>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <button className="btn btn-danger btn-sm px-3 py-2" onClick={() => handleProjDelete(proj._id)}>Delete</button>
                                            </div>
                                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                            <div className="taskTable" style={{margin: "2rem 5rem"}}> 
                                <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col">Task Name</th>
                                    <th scope="col">Delete Task</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {taskData?.map(task => (
                                        <tr>
                                        <td>{task.name}</td>
                                        <td>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <button className="btn btn-danger btn-sm px-3 py-2" onClick={() => handleTaskDelete(task._id)}>Delete</button>
                                            </div>
                                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
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

export default Setting;