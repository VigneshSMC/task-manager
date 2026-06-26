import { Form, redirect } from 'react-router-dom'
import { userlogin } from '../services/authService'
import { useEffect, useState } from 'react'
import { useActionData } from 'react-router-dom'

export default function Login() {

    const actionData = useActionData()
    console.log(actionData?.error)

    useEffect(() => {
        setPopUp(true)
    }, [actionData])

    const [popUp, setPopUp] = useState()

    return (
        <main className="login">
            <h2>Login</h2>
            <section>
                <Form method="post">
                    <div>
                        <label htmlFor="name">Email: </label>
                        <input name="email" type="email" id="name" />
                    </div>
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input name="password" type="password" id="password" />
                    </div>
                    <button>LOGIN</button>
                </Form>
                {actionData?.error && popUp && <span className='error'><h4>{actionData.error}</h4><h3 onClick={() => setPopUp(false)} className='close'>&times;</h3></span>}
            </section>
        </main>
    )
}

const loginAction = async ({ request }) => {
    try {
        const formData = await request.formData()
        const cleanedData = Object.fromEntries(formData)
        const response = await userlogin(cleanedData)
        return redirect("/dashboard")
    }
    catch (error) {
        console.log(error.response)
        return {
            error: error.response?.data?.error
        }
    }
}

export { loginAction }