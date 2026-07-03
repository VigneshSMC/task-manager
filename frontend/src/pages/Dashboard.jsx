import { Container } from "react-bootstrap"
import { Outlet, NavLink } from "react-router-dom"

const Dashboard = () => {
    return (
        <main>
            <h1 className="text-center py-4 mb-4 display-5 bg-primary text-white fw-bold">Dashboard</h1>
            <Outlet />
        </main>
    )
}

export default Dashboard