import { Outlet, NavLink } from "react-router-dom";

export default function RootPage() {
    return (
        <div className="rootpage">
            <h1>Home</h1>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/registration">Registration</NavLink>
            <Outlet />
        </div>
    )
}