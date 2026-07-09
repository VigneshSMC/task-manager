import { fetchAuthSession, getCurrentUser, signInWithRedirect } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../store/store";
import { addUser } from "../slice/UserSlice";

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
                    console.log("inside requireAuth")
                    const user = await getCurrentUser()
                    console.log("user", user)
                    const email = user?.signInDetails?.loginId || []
                    const groups = session?.tokens?.idToken?.payload['cognito:groups'] || []
                    store.dispatch(addUser({ email, groups }))
                    console.log("from redux", store.getState().user)

                    setAuthenticated(true);
                    setLoading(false)
                } else {
                    setLoading(false)
                    navigate("/", { replace: true })
                }
            }
            catch (e) {
                console.log(e)
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