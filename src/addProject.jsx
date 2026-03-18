import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const ProjectModal = ({onSuccess}) => {

    const [projInfo, setProjInfo] = useState({
        name: "", 
        description: "",
    })
    
    async function handleProject(e){
        e.preventDefault()
        try{
            const token = localStorage.getItem("token")

            const response = await axios.post("http://localhost:3000/projects",projInfo, 
                {headers: {
                    Authorization: `Bearer ${token}`
                }}
            )

            if(response){
                setProjInfo({
                    name: "", 
                    description: "",
                })
                onSuccess()
                toast.success("New project added successfully.")
            }
        }catch(err){    
            console.log(err.response?.data.message)
            toast.error("Error occured while adding new project!")
        }
    }

    return (
    <div class="modal fade" id="projectModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Create New Project</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={(e) => handleProject(e)}>
                <div class="modal-body">
                    <label className="fs-5">Project Name</label><br />
                    <input type="text" value={projInfo.name} onChange={(e) => setProjInfo({...projInfo,name: e.target.value})} className="form-control mt-2" placeholder="Enter Project Name" required/><br />
                    <label className="fs-5">Project Description</label><br />
                    <textarea type="text" value={projInfo.description} onChange={(e) => setProjInfo({...projInfo,description: e.target.value})} className="form-control mt-2" placeholder="Enter Project Description"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" style={{background: "#1A1D29", color: "#fff"}} class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" style={{background: "#2F3E8F", color: "#fff"}} class="btn btn-primary">Create</button>
                </div>
            </form>
            </div>
        </div>
    </div>
    )
}

export default ProjectModal