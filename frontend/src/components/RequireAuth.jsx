import { fetchAuthSession, signInWithRedirect } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        async function check() {
            try {
                const session = await fetchAuthSession();
                console.log('session', session)

                if (session.tokens?.accessToken) {
                    setAuthenticated(true);
                    setLoading(false)
                } else {
                    setLoading(false)
                    navigate("/", { replace: true })
                }
            }
            catch (e) {
                navigate("/", { replace: true })
            }
            finally {
                setLoading(false);
            }
        }

        check();
    }, []);

    if (loading) {
        return <h3 className="text-center mt-5">Checking authentication...</h3>;
    }

    return authenticated ? children : null;
}