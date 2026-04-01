import Navbar from "./navbar";
import { Chart as ChartJS, defaults} from "chart.js/auto";
import { Bar } from "react-chartjs-2" 
import { useFetch } from "./useFetch";


defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "center";
defaults.plugins.title.color = "black";

//defaults.font.size = 16;

const AllReports = () => {
    const {data: closedByTeam, error: closedByTeamError, loading: closedByTeamLoading} = useFetch("https://project-pulse-backend-nine.vercel.app/report/closed-tasks/teams")
    const {data: closedByOwner, error: closedByOwnerError, loading: closedByOwnerLoading} = useFetch("https://project-pulse-backend-nine.vercel.app/report/closed-tasks/owners")
    const {data: closedByProject, error: closedByProjectError, loading: closedByProjectLoading} = useFetch("https://project-pulse-backend-nine.vercel.app/report/closed-tasks/projects")
    const {data: closedLW, error: closedLwError, loading: closedLwLoading} = useFetch("https://project-pulse-backend-nine.vercel.app/report/last-week")
    const {data: taskData} = useFetch("https://project-pulse-backend-nine.vercel.app/tasks")

    function calcPendingTasks(){
        const taskPending = taskData?.filter(task => task.status !== "Completed")
        let pendingWork = []
        if(taskPending && taskPending.length !== 0){
            taskPending.map(task => {
                pendingWork = [...pendingWork, {label: task.name, time: task.timeToComplete}]
            })
        }
   
        return pendingWork
    }

    return (
        <div className="dbFullScreen">
            <div className="fixToTop">
                <Navbar page={"report"}/>
            </div>
            <div className="col-lg-9 col-xl-10 col-12">
                {closedByOwner && closedByTeam && closedByProject && closedLW
                ?
                <div className="container">
                    <div className="reportHeading">
                        <h2>Report</h2>
                    </div>
                    <div>
                        <div className="allGraphs">
                            <div className="barGraph col-12 col-lg-9 col-xl-10">
                                <Bar
                                    data={{
                                        labels: (calcPendingTasks().map(data => data.label)),
                                        datasets: [
                                            {
                                                label: "Work Pending (In Days)",
                                                data: (calcPendingTasks().map(data => data.time)),
                                                backgroundColor: ["#1F6F6F", "#C26A00", "#6B2C5C"],
                                                borderRadius: 2,
                                            },
                                        ]
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                text: `Days of Work Pending (Total ${(calcPendingTasks().map(data => data.time)).reduce((acc, curr) => acc = acc + curr,0)} Days of Work Pending)`,
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="barGraph col-12 col-lg-9 col-xl-10">
                                <Bar
                                    data={{
                                        labels: Object.keys(closedByOwner),
                                        datasets: [
                                            {
                                                label: "Tasks Completed",
                                                data: Object.values(closedByOwner),
                                                backgroundColor: ["#1F6F6F", "#C26A00", "#6B2C5C"],
                                                borderRadius: 2,
                                            },
                                        ]
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                text: "Tasks Closed by Owner",
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="barGraph col-12 col-lg-9 col-xl-10">
                                <Bar
                                    data={{
                                        labels: Object.keys(closedByTeam),
                                        datasets: [
                                            {
                                                label: "Tasks Completed",
                                                data: Object.values(closedByTeam),
                                                backgroundColor: ["#1F6F6F", "#C26A00", "#6B2C5C"],
                                                borderRadius: 2,
                                            },
                                        ]
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                text: "Tasks Closed by Team",
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="barGraph col-12 col-lg-9 col-xl-10">
                                <Bar
                                    data={{
                                        labels: Object.keys(closedByProject),
                                        datasets: [
                                            {
                                                label: "Tasks Completed",
                                                data: Object.values(closedByProject),
                                                backgroundColor: ["#1F6F6F", "#C26A00", "#6B2C5C"],
                                                borderRadius: 2,
                                            },
                                        ]
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                text: "Tasks Closed by Project",
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="barGraph col-12 col-lg-9 col-xl-10">
                                <Bar
                                    data={{
                                        labels: Object.keys(closedLW),
                                        datasets: [
                                            {
                                                label: "Tasks Closed",
                                                data: Object.values(closedLW),
                                                backgroundColor: ["#1F6F6F", "#C26A00", "#6B2C5C"],
                                                borderRadius: 2,
                                            },
                                        ]
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                text: `Work Done Last Week (Total ${Object.values(closedLW).reduce((acc, curr) => acc = acc + curr,0)} tasks closed last week)`,
                                            }
                                        }
                                    }}
                                />
                            </div>
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

export default AllReports;