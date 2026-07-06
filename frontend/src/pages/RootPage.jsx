import { Button, Container } from "react-bootstrap";
import { Outlet, NavLink, redirect } from "react-router-dom";

import { fetchAuthSession, signInWithRedirect } from "aws-amplify/auth";

export default function RootPage() {

    const handleAwsSignIn = async () => {
        try {
            await signInWithRedirect()
        }
        catch(e) {
            console.log("Aws hosted UI redirection failed", e)
        }
    }

    return (
        <Container className="d-flex flex-row justify-content-center align-items-center gap-2" style={{marginTop: '8rem'}}>
                <h1 className="py-3 px-4 me-5 rounded bg-primary text-white">SMART TASK MANAGER</h1>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <Outlet />
                </div>
        </Container>
    )
}