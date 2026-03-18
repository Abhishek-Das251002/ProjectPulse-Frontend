import {useNavigate} from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { GoProject } from "react-icons/go";
import { RiTeamLine } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { Settings } from "lucide-react";

export const Navbar = ({page}) => {

    const navigate = useNavigate()

    return (
        <div className="col-2 myNavbar" /*style={{background: "#F4F6F9", minHeight: '100vh'}}*/>
            <h3 style={{color: "#2F3E8F", fontWeight:"bolder", margin: "2rem 2rem"}}>ProjectPulse</h3>
            <ul className="navigation">
                <li onClick={() => navigate("/dashboard")} className={page === "dashboard"? "active": ""}>
                    <MdOutlineDashboard className="mx-1"/>Dashboard
                </li>
                <li className={page === "project" || page === "task"? "active": ""} onClick={page === "task"? () => navigate(-1) : () => navigate("")}>
                    <GoProject className="mx-1"/>Projects
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
            </ul>
        </div>
    )
}

export default Navbar;