import ProjectModal from "./addProject";
import { useFetch } from "./useFetch";
import { PlusIcon } from "lucide-react";
import TaskModal from "./addTask";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import CalcDueDate from "./calcDueDate";
import { use, useEffect, useState } from "react";

const Dashboard = () => {
    useFetch("https://project-pulse-backend-nine.vercel.app/projects")
    return (
        <h1>Dashboard Page</h1>
    )
}

export default Dashboard;
