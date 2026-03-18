import Navbar from "./navbar";
import { Chart as ChartJS, defaults} from "chart.js/auto";
import { Bar } from "react-chartjs-2" 
import { useFetch } from "./useFetch";


defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "center";
defaults.plugins.title.color = "black";

defaults.font.size = 16;

const AllReports = () => {
    const {data: pendingData, error: pendingError} = useFetch("https://project-pulse-backend-plum.vercel.app/report/pending")
    const {data: closedByTeam, error: closedByTeamError} = useFetch("https://project-pulse-backend-plum.vercel.app/report/closed-tasks/teams")
    const {data: closedByOwner, error: closedByOwnerError} = useFetch("https://project-pulse-backend-plum.vercel.app/report/closed-tasks/owners")
    const {data: closedByProject, error: closedByProjectError} = useFetch("https://project-pulse-backend-plum.vercel.app/report/closed-tasks/projects")
    const {data: closedLW, error: closedLwError} = useFetch("https://project-pulse-backend-plum.vercel.app/report/last-week")

    return (
        <div className="row">
            <Navbar page={"report"}/>
            <div className="col-10">
                <div style={{margin: "2rem 2rem"}}>
                    <h2>Report</h2>
                </div>
                <div className="body">
                    {pendingData && closedByOwner && closedByTeam && closedByProject && closedLW &&
                    <div className="allGraphs">
                        <div className="barGraph">
                            <Bar
                                data={{
                                    labels: Object.keys(pendingData),
                                    datasets: [
                                        {
                                            label: "Work Pending (In Days)",
                                            data: Object.values(pendingData),
                                            backgroundColor: ["#1F6F6F", "#C26A00", "#6B2C5C"],
                                            borderRadius: 5,
                                        },
                                    ]
                                }}
                                options={{
                                    plugins: {
                                        title: {
                                            text: `Days of Work Pending (Total ${Object.values(pendingData).reduce((acc, curr) => acc = acc + curr,0)} Days of Work Pending)`,
                                            font: {
                                                size: 20
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="barGraph">
                            <Bar
                                data={{
                                    labels: Object.keys(closedByOwner),
                                    datasets: [
                                        {
                                            label: "Tasks Completed",
                                            data: Object.values(closedByOwner),
                                            backgroundColor: ["#1F6F6F", "#C26A00", "#6B2C5C"],
                                            borderRadius: 5,
                                        },
                                    ]
                                }}
                                options={{
                                    plugins: {
                                        title: {
                                            text: "Tasks Closed by Owner",
                                            font: {
                                                size: 20
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="barGraph">
                            <Bar
                                data={{
                                    labels: Object.keys(closedByTeam),
                                    datasets: [
                                        {
                                            label: "Tasks Completed",
                                            data: Object.values(closedByTeam),
                                            backgroundColor: ["#1F6F6F", "#C26A00", "#6B2C5C"],
                                            borderRadius: 5,
                                        },
                                    ]
                                }}
                                options={{
                                    plugins: {
                                        title: {
                                            text: "Tasks Closed by Team",
                                            font: {
                                                size: 20
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="barGraph">
                            <Bar
                                data={{
                                    labels: Object.keys(closedByProject),
                                    datasets: [
                                        {
                                            label: "Tasks Completed",
                                            data: Object.values(closedByProject),
                                            backgroundColor: ["#1F6F6F", "#C26A00", "#6B2C5C"],
                                            borderRadius: 5,
                                        },
                                    ]
                                }}
                                options={{
                                    plugins: {
                                        title: {
                                            text: "Tasks Closed by Project",
                                            font: {
                                                size: 20
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="barGraph">
                            <Bar
                                data={{
                                    labels: Object.keys(closedLW),
                                    datasets: [
                                        {
                                            label: "Tasks Closed",
                                            data: Object.values(closedLW),
                                            backgroundColor: ["#1F6F6F", "#C26A00", "#6B2C5C"],
                                            borderRadius: 5,
                                        },
                                    ]
                                }}
                                options={{
                                    plugins: {
                                        title: {
                                            text: `Work Done Last Week (Total ${Object.values(closedLW).reduce((acc, curr) => acc = acc + curr,0)} tasks closed last week)`,
                                            font: {
                                                size: 20
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default AllReports;