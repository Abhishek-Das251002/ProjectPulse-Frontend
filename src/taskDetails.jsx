import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import { useFetch } from "./useFetch";
import CalcDueDate from "./calcDueDate";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CurrTask = () => {
    const {id} = useParams()

    const {data, error, refetch} = useFetch("https://project-pulse-backend-nine.vercel.app/tasks")
    const selectedTask = data?.filter(task => task._id === id)

    function calRemainingDays(dueTime, creationTime){
        const date1 = new Date(CalcDueDate(dueTime, creationTime));
        const date2 = new Date();
        const diffTime = (date1 - date2);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
        return diffDays;
    }


    async function handleStatus(e){
        const {checked} = e.target;

        try{    
            const token = localStorage.getItem("token")
            if(checked){
                const response = await axios.post(`https://project-pulse-backend-nine.vercel.app/tasks/${id}`, {status: "Completed"}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(response){
                    toast.success("Status updated Successfully")
                    refetch()
                }
            }else{
                const response = await axios.post(`https://project-pulse-backend-nine.vercel.app/tasks/${id}`, {status: "In Progress"}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(response){
                    toast.success("Status updated Successfully")
                    refetch()
                }
            }
        }catch(error){
            console.log(error)
        }
    }


    return (
        <div className="dbFullScreen">
            <div className="fixToTop">
                <Navbar page={"task"}/>
            </div>
            <div className="col-lg-9 col-xl-10 col-12 container">
                {data 
                ?
                <div>
                    <div className="currTaskHeading">
                        {selectedTask?.map(task => (
                            <div>
                                <h3>{task.name}</h3>
                            </div> 
                        ))}
                    </div>
                    <div>
                        <div className="taskTable currTaskTable">
                            <table className="myTaskTable">
                            <thead>
                                <tr>
                                <th scope="col">PROJECT</th>
                                <th scope="col">TEAM</th>
                                <th scope="col">TAGS</th>
                                <th scope="col">DUE ON</th>
                                <th scope="col">TIME REMAINING</th>
                                <th scope="col">STATUS</th>
                                <th scope="col">MARK COMPLETE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedTask?.map(task => (
                                    <tr>
                                    <td>{task.project ? task.project.name : "Unknown"}</td>
                                    <td>{task.team.name}</td>
                                    <td>{(task.tags.map(tag => tag.name).join(", "))}</td>
                                    <td>{CalcDueDate(task.timeToComplete, task.createdAt)}</td>
                                    <td>{calRemainingDays(task.timeToComplete, task.createdAt) > 0 ? `${calRemainingDays(task.timeToComplete, task.createdAt)} Days` : "Due Date Passed"}</td>
                                    <td>{task.status}</td>
                                    <td>
                                        <input type="checkbox" checked={task.status === "Completed" ? true : false} onChange={handleStatus}/> Mark as complete
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
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

export default CurrTask;