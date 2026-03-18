import { useState } from "react";
import axios from "axios";
import checkEmail from "./validateEmail"
import { toast } from "react-toastify";

export const MemberModal = ({teamId, onSuccess}) => {

    const [member, setMember] = useState({
        name: "",
        email: ""
    })

    function handleChange(e){
        const {name, value} = e.target;
        setMember(prev => ({...prev, [name]: value}))
    }

    async function handleSubmit(e){
        e.preventDefault()
        try{
            if(!checkEmail(member.email)){
                toast.error("please enter valid email address")
                return;
            }

            const token = localStorage.getItem("token")
            
            const response = await axios.post("http://localhost:3000/users", member,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if(response){
                try{
                    const addToTeam = await axios.post(`http://localhost:3000/teams/${teamId}`, response.data.saveUser,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(addToTeam){
                    setMember({
                        name: "",
                        email: ""
                    })
                    onSuccess()
                    toast.success("Member added successfully.")
                }
                }catch(error){
                    console.log(error)
                    toast.error("Error occured while adding member!")
                }
            }
        }catch(error){
            console.log(error)
            toast.error("Error occured while adding member!")
        }
    }


    return (
        <div class="modal fade" id="memberModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Add Member</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit={(e) => handleSubmit(e)}>
                <div class="modal-body memberModalBody">
                    <label>Member Name</label>
                    <input type="text" name="name" value={member.name} placeholder="Member Name" className="form-control" onChange={handleChange} required/>
                    <label>Member Email</label>
                    <input type="text" name="email" value={member.email} placeholder="Member Email" className="form-control" onChange={handleChange} required/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn" style={{background: "#2F3E8F", color: "#fff"}}>Create</button>
                </div>
                </form>
                </div>
            </div>
        </div>
    )
}

export default MemberModal;