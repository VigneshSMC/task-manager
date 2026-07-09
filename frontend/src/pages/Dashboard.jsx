import { signOut } from "aws-amplify/auth"
import { useState } from "react"
import { Card, Container, Form } from "react-bootstrap"
import { Outlet, NavLink, useNavigate, useNavigation } from "react-router-dom"
import { useTheme } from "../components/ThemeContext"

const Dashboard = () => {

    const navigate = useNavigate()
    const navigation = useNavigation()

    const isSubmitting = navigation.state === 'submitting'

    const [showLogout, setShowLogout] = useState(false)
    const { theme, toggleTheme } = useTheme()

    const userSignOut = () => {
        signOut()
        navigate("/login")
    }

    return (
        <main className="d-flex-inline">
            <div className="m-2 mb-3 rounded bg-primary d-flex justify-content-center align-items-center px-4">
                <h1 className="text-white size-sm fs-5 fw-light m-0">DASHBOARD</h1>
                <div className="d-flex gap-3 align-items-center position-relative ms-auto" style={{ zIndex: 10 }}>
                    <Form.Check type="switch" id="dark-mode-switch" label={theme === 'dark' ?
                        (
                            <i className="bi bi-moon-stars-fill text-warning pe-1"></i>
                        ) : (
                            <i className="bi bi-sun-fill text-warning pe-1"></i>
                        )}
                        checked={theme === 'dark'} onChange={toggleTheme}
                        className="d-flex align-items-center me-3 rounded gap-2" />
                    <i
                        onClick={() => setShowLogout(!showLogout)}
                        className="bi bi-box-arrow-right fs-4 text-white"
                        style={{ cursor: 'pointer' }}
                    ></i>
                    {showLogout && (
                        <Card
                            className="p-3 position-absolute end-0 top-100 mt-2 shadow"
                            style={{ minWidth: '120px' }}
                        >
                            <button onClick={() => userSignOut()} className="btn btn-sm btn-danger w-100">Log out
                                <span className="spinner"></span>
                            </button>
                        </Card>
                    )}

                </div>
            </div>
            <Outlet/>
        </main>
    )
}

export default Dashboard
