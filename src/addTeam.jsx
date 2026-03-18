import { useState } from "react";
import checkEmail from "./validateEmail";
import { toast } from 'react-toastify';
import axios from "axios";

export const TeamModal = ({onSuccess}) => {

    const [teamName, setTeamName] = useState("")

    const [allMembers, setMembers] = useState([
        {
            id: 1,
            name: "",
            email: "",
        },
        {
            id: 2, 
            name: "",
            email: ""
        }, 
        {
            id: 3,
            name: "",
            email: ""
        }
    ])

    function handleChange(e){
        const {name, value, id} = e.target;

        if(name === "team"){
            setTeamName(value)
        }else{
            setMembers(allMembers.map(member => (
                member.id == id
                ?
                {...member, [name]: value}
                : 
                member
            )))
        }
    }


    async function handleSubmit(e){
        e.preventDefault()  

        const validMembers = allMembers
        .filter(member => member.name && member.email)
        .map(member => ({ name: member.name, email: member.email }))

        if(validMembers.length === 0){
            toast.error('Please add atleast 1 member')
            return
        }else{
            for(let member of allMembers){
                if(!member.name && member.email){    
                    toast.error(`please Enter name of member ${member.id}`)
                    return    
                }else if(!member.email && member.name){
                    toast.error(`please Enter email of member ${member.id}`)
                    return 
                }else if(member.name && member.email && !checkEmail(member.email)){
                    toast.error(`Invalid email of member ${member.id}`)
                    return
                }
            }
        }

        try{    
            const token = localStorage.getItem("token")

            const response = await axios.post("https://project-pulse-backend-plum.vercel.app/users", validMembers,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if(response){

                const newMembers = (response.data.saveUser).map(member => member._id)
                
                const newTeam = {
                    name: teamName,
                    members: newMembers,
                }

                try{
                    const addToTeam = await axios.post("https://project-pulse-backend-plum.vercel.app/teams", newTeam,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(addToTeam){
                    e.target.reset()
                    onSuccess()
                    toast.success("Team added successfully")
                }
                }catch(error){
                    console.log(error)
                    toast.error("An error occured while adding team")
                }
            }        
        }catch(error){
            console.log(error)
            toast.error("An error occured while adding team")
        }
    }


    return (
        <div class="modal fade" id="teamModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Add Team</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div class="modal-body memberModalBody">
                        <div>
                            <label>Team Name</label><br />
                            <input type="text" className="form-control" name="team" value={teamName} placeholder="Enter Team Name" onChange={handleChange} required/>
                        </div>
                        <div>
                            <label>Add Members</label><br />
                            <div>
                                <div className="d-flex">
                                    <input type="text" id="1" name="name" className="form-control" placeholder="Member_1 Name" onChange={handleChange}/>
                                    <input type="text" id="1" name="email" className="form-control ms-2" placeholder="member1@gmail.com" onChange={handleChange}/>
                                </div>
                                <div className="d-flex mt-3">
                                    <input type="text" id="2" name="name" className="form-control" placeholder="Member_2 Name" onChange={handleChange}/>
                                    <input type="text" id="2" name="email" className="form-control ms-2" placeholder="member2@gmail.com" onChange={handleChange}/>
                                </div>
                                <div className="d-flex mt-3">
                                    <input type="text" id="3" name="name" className="form-control" placeholder="Member_3 Name" onChange={handleChange}/>
                                    <input type="text" id="3" name="email" className="form-control ms-2" placeholder="member3@gmail.com" onChange={handleChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn" style={{background: "#2F3E8F", color: "#fff"}}>Create Team</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    )
}

export default TeamModal;