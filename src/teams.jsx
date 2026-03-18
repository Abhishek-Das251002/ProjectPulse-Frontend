import Navbar from "./navbar";
import { PlusIcon } from "lucide-react";
import { useFetch } from "./useFetch";
import TeamModal from "./addTeam";
import { useNavigate } from "react-router-dom";

const Teams = () => {
    const {data: teamData, error: errorData, refetch} = useFetch("https://project-pulse-backend-plum.vercel.app/teams")
    const navigate = useNavigate()

    return (
        <div className="row">
            <Navbar page={"teams"}/>
            <TeamModal onSuccess={refetch}/>
            <div className="col-10">
                {teamData
                ?
                <div>
                    <div className="body">
                        <div className="dbHeadings" style={{margin: "2rem 0rem"}}>
                            <div className="fs-2 fw-semibold">Teams</div>
                            <div className="d-flex justify-content-center align-items-center">
                                <button style={{background: "#2F3E8F", color: "#fff"}} className="btn btn px-2 py-1" data-bs-toggle="modal" data-bs-target="#teamModal"><PlusIcon size={20}/> New Team</button>
                            </div>
                        </div>
                        <div className="row">
                            {teamData?.map(team => (
                                <div className="col-4">
                                    <div class="card teamCard" style={{background: "#F4F6F9", border: "none", margin: "1rem 0rem"}} onClick={() => navigate(`/teams/${team._id}`)}>
                                        <div class="card-body">
                                            <h4 class="card-title">{team.name} Team</h4>
                                            {team.members.length == 1 ? <div className="mt-3 text-secondary">{team.members[0].name}</div> : team.members.length == 2 ? <div className="mt-3 text-secondary">{team.members[0].name}, {team.members[1].name}</div> : <div className="mt-3 text-secondary">{team.members[0].name}, {team.members[1].name}...+{team.members.length - 2} more</div> }    
                                        </div>
                                    </div>
                                </div>
                            ))}
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

export default Teams;