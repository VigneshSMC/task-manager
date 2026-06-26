import { Outlet, NavLink } from "react-router-dom"

const Dashboard = () => {
    return (
        <main className="dashboard">
        <h1>Dashboard</h1>
        <Outlet/>
        </main>
    )
}

export default Dashboard