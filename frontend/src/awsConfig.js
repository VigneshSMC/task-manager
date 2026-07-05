import { Amplify } from "aws-amplify";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: "us-east-1_xABDgI27e",
            userPoolClientId: "24kbncfjb04asci4r1me4mfki9",
            // identityPoolId: "us-east-1:cdda0e61-d817-43c3-b3bf-b5d8979268f1",

            loginWith: {
                oauth: {
                    domain:
                        "us-east-1xabdgi27e.auth.us-east-1.amazoncognito.com",

                    scopes: [
                        "openid",
                        "email",
                        "profile"
                    ],

                    redirectSignIn: [
                        "http://localhost:5173/dashboard"
                    ],

                    redirectSignOut: [
                        "http://localhost:5173/"
                    ],

                    responseType: "code"
                }
            }
        }
    }
});