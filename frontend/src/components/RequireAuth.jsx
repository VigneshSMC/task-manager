import { fetchAuthSession, signInWithRedirect } from "aws-amplify/auth";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        async function check() {
            try {
                const session = await fetchAuthSession();
                console.log('session', session)

                if (session.tokens?.idToken) {
                    setAuthenticated(true);
                } else {
                    await signInWithRedirect();
                }
            } finally {
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