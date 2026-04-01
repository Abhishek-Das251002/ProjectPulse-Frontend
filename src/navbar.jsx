import {useNavigate} from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { GoProject } from "react-icons/go";
import { RiTeamLine } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Navbar = ({page}) => {

    const navigate = useNavigate()

    return (
        <div>
            <div className="d-lg-none" style={{background: "#F4F6F9", padding: "5px 0px"}}>
                <nav class="navbar navbar-expand-lg container">
                    <div class="container-fluid">
                        <NavLink to="/dashboard" style={{color: "#2F3E8F", fontWeight: "bolder", textDecoration: "none"}}>ProjectPulse</NavLink>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                            <NavLink to="/dashboard" style={({isActive}) => ({color: isActive? "#2F3E8F" : "black", textDecoration: "none"})}>Dashboard</NavLink>
                            <NavLink to="/teams" style={({isActive}) => ({color: isActive? "#2F3E8F" : "black", textDecoration: "none"})}>Teams</NavLink>
                            <NavLink to="/report" style={({isActive}) => ({color: isActive? "#2F3E8F" : "black", textDecoration: "none"})}>Reports</NavLink>
                            <NavLink to="/setting" style={({isActive}) => ({color: isActive? "#2F3E8F" : "black", textDecoration: "none"})}>Setting</NavLink>
                            <NavLink onClick={page==="task" ? () => navigate(-1): () => navigate("")} style={{color: page==="task" || page==="project"? "#2F3E8F" : "gray", textDecoration: "none"}}>Project</NavLink>
                        </div>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="d-none d-lg-block">
                <h3 style={{color: "#2F3E8F", fontWeight:"bolder", margin: "2rem 2rem"}}>ProjectPulse</h3>
                <ul className="navigation">
                    <li onClick={() => navigate("/dashboard")} className={page === "dashboard"? "active": ""}>
                        <MdOutlineDashboard className="mx-1"/>Dashboard
                    </li>
                    <li onClick={page === "teamDetail" ? () => navigate(-1) : () => navigate("/teams")} className={page === "teams" || page === "teamDetail" ? "active": ""}>
                        <RiTeamLine className="mx-1"/>Teams
                    </li>
                    <li className={page === "report"? "active": ""} onClick={() => navigate("/report")}>
                        <TbReportSearch className="mx-1"/>Reports
                    </li>
                    <li className={page === "setting"? "active": ""} onClick={() => navigate("/setting")}>
                        <Settings className="mx-1"/>Setting
                    </li>
                    <li className={page === "project" || page === "task"? "active": "disabled"} onClick={page === "task"? () => navigate(-1) : () => navigate("")}>
                        <GoProject className="mx-1"/>Project
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;