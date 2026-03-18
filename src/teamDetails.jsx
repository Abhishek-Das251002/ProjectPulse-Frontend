import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./navbar";
import { useFetch } from "./useFetch";
import { PlusIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import MemberModal from "./addMember";
import { useEffect } from "react";

const CurrTeam = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const {data: teamData, error: teamError, refetch} = useFetch("https://project-pulse-backend-plum.vercel.app/teams")
    const selectedTeam = teamData?.filter(team => team._id === id)

    return (
        <div className="row">
            <Navbar page={"teamDetail"}/>
            <MemberModal teamId={id}  onSuccess={refetch}/>
            {teamData
            ?
            <div className="col-10">
                <div className="body">
                {selectedTeam?.map(team => (
                    <div>
                        <div style={{color: "#2F3E8F",display: "flex", marginTop: "1.5rem", fontSize: "1.3rem", alignItems: "center", fontWeight: "bolder", cursor: "pointer"}} onClick={() => navigate(-1)}>
                            <ArrowLeft className="me-2"/> Back To Teams
                        </div>
                        <h2 style={{margin: "2rem 0rem"}}>{team.name} Team</h2>
                        <h4 className="text-secondary">Members</h4>
                        <ol>
                            {team.members.map(member => (
                                <li className="my-3 fs-5">{member.name}</li>
                            ))}
                        </ol>
                        <div className="d-flex align-items-center">
                            <button style={{background: "#2F3E8F", color: "#fff", marginTop: "2rem"}} className="btn btn px-2 py-1" data-bs-toggle="modal" data-bs-target="#memberModal"><PlusIcon size={20}/> Add Member</button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            :
            <p className="text-center text-secondary fs-5 mt-4">Loading...</p>
            }
        </div>
    )
}

export default CurrTeam;