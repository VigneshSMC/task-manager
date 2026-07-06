import { signOut } from "aws-amplify/auth"
import { useState } from "react"
import { Card, Container } from "react-bootstrap"
import { Outlet, NavLink, useNavigate, useNavigation } from "react-router-dom"

const Dashboard = () => {

    const navigate = useNavigate()
    const navigation = useNavigation()

    const isSubmitting = navigation.state === 'submitting'

    const [showLogout, setShowLogout] = useState(false)

    const userSignOut = () => {
        signOut()
        navigate("/login")
    }

    return (
        <main>
            <div className="text-center py-4 mb-4 bg-primary d-flex justify-content-center align-items-center px-4">
                <h1 className="text-white fw-bold display-5 m-0">Dashboard</h1>
                <div className="position-relative ms-auto" style={{ zIndex: 10 }}>
                    <i 
                        onClick={() => setShowLogout(!showLogout)} 
                        className="bi bi-box-arrow-right display-6 text-white" 
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
            <Outlet />
        </main>
    )
}

export default Dashboard
