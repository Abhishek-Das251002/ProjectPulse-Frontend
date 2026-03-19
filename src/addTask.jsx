import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import axios from "axios";
import { toast } from "react-toastify";

export const TaskModal = ({id, onSuccess}) => {

    const [taskDetails, setTaskDetails] = useState({
        name: "",
        project: "",
        team: "",
        owners: [],
        tags: [],
        timeToComplete: "",
        status: "",
        priority: ""
    })

    const [newTag, setNewTag] = useState("")

    const {data: projData, error: projError, refetch: projRefetch} = useFetch("https://project-pulse-backend-plum.vercel.app/projects")
    const {data: teamData, error: teamError} = useFetch("https://project-pulse-backend-plum.vercel.app/teams")
    const {data: tagData, error: tagError, refetch: tagRefetch} = useFetch("https://project-pulse-backend-plum.vercel.app/tags")
    
    function handleChange(e){
        const {value, name} = e.target;

        if(name === "owners" || name === "tags"){
            const {checked} = e.target
            if(checked){
                setTaskDetails({...taskDetails, [name]: [...taskDetails[name], value]})
            }else{
                setTaskDetails({...taskDetails, [name]: taskDetails[name].filter(item => value !== item)})
            }     
        }else{
            setTaskDetails({...taskDetails, [name]: value})
        }
    }

    async function handleSubmit(e){
        e.preventDefault()
        try{
            let token = localStorage.getItem("token")

            if(taskDetails.owners.length === 0){
                toast.error("please select atleast one owner")
                return;
            }

            const response = await axios.post("https://project-pulse-backend-plum.vercel.app/tasks", taskDetails,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )

            if(response){
                e.target.reset()
                setTaskDetails({
                    name: "",
                    project: "",
                    team: "",
                    owners: [],
                    tags: [],
                    timeToComplete: "",
                    status: "",
                    priority: ""
                })
                onSuccess()
                toast.success("New task added successfully.")
            }
        }catch(error){
            console.log(error)
            toast.error("Error occured while adding new task!")
        }
    }

    function getProjName(projId) {
        const chooseProj = projData?.find(proj => proj._id === projId);
        if(chooseProj){
            return chooseProj.name
        }
    }

    function handleNewTag(e){
        const {value} = e.target;
        setNewTag(value)
    }

    async function addNewTag(){
        try{
            const token = localStorage.getItem("token")

            const response = await axios.post("https://project-pulse-backend-plum.vercel.app/tags",{name: newTag},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response){
                toast.success("New Tag Added.")
                setNewTag("")
                tagRefetch()    
            }
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        projRefetch()
    },[projData])


    return (
        <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Add Task</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div class="modal-body taskModalBody" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                    <div>
                        <label>Select Project</label><br />
                        {id
                        ?
                        <select className="form-select" name="project"  value={taskDetails.project = id} onChange={handleChange} required>
                            <option>{getProjName(id)}</option>
                        </select>
                        :
                        <select className="form-select" name="project"  value={taskDetails.project} onChange={handleChange} required>
                            <option value="">---Select-Project---</option>
                            {projData?.map(proj => (
                                <option value={proj._id}>{proj.name}</option>
                            ))}
                         </select>
                        }
                    </div>
                    <div>
                        <label>Task Name</label><br />
                        <input type="text" placeholder="Enter Task Name" className="form-control" name="name" value={taskDetails.name} onChange={handleChange} required/>
                    </div>
                    <div>
                        <label>Select Team</label><br />
                        <select className="form-select" name="team" value={taskDetails.team} onChange={handleChange} required>
                            <option value="">---Select-Team---</option>
                            {teamData?.map(team => (
                                <option value={team._id}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Select Owners</label><br />
                        <div className="owners">
                        {taskDetails.team 
                        ?
                        (teamData.find(team => team._id === taskDetails.team).members.map(member => (
                            <div className="mx-2">
                                <input type="checkbox" name="owners" value={member._id} onChange={handleChange}/> {member.name}
                            </div>
                        )))
                        :
                        <p className="text-secondary">Please select a team to add owners</p>
                        }
                        </div>
                    </div>
                    <div>
                        <label>Estimated Time</label>
                        <input type="number" name="timeToComplete" placeholder="Enter Estimated Time" className="form-control" value={taskDetails.timeToComplete} onChange={handleChange} required/>
                    </div> 
                    <div>
                        <label>Status</label><br />
                        <select name="status" className="form-select" value={taskDetails.status} onChange={handleChange} required>
                            <option value="">---Select-Status---</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label>Priority</label><br />
                        <select name="priority" className="form-select" value={taskDetails.priority} onChange={handleChange} required>
                            <option value="">---Select-Priority---</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div>
                        <label>Tags</label>
                        <div className="tags">
                        {
                            tagData?.map(tag => (
                                <div className="mx-2">
                                    <input type="checkbox" name="tags" value={tag._id} onChange={handleChange} /> {tag.name}
                                </div>
                            ))
                        }  
                        </div>     
                    </div>
                    <div>
                        <label>Add New Tag</label>
                        <div className="row">
                            <div className="col-9">
                                <input type="text" placeholder="Enter Tag Name" className="form-control" value={newTag} onChange={handleNewTag}/>
                            </div>
                            <div className="col-3">
                                <button type="button" class="btn btn-primary" style={{background: "#2F3E8F", color: "#fff"}} onClick={() => addNewTag()}>Add Tag</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" style={{background: "#1A1D29", color: "#fff"}} data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" style={{background: "#2F3E8F", color: "#fff"}}>Create</button>
                </div>
            </form>
        </div>
    </div>
</div>
)
}

export default TaskModal;