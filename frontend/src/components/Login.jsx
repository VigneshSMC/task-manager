import { Form, NavLink, redirect } from 'react-router-dom'
import { userlogin } from '../services/authService'
import { useEffect, useState } from 'react'
import { useActionData } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export default function Login() {

    const actionData = useActionData()
    console.log(actionData?.error)

    useEffect(() => {
        setPopUp(true)
    }, [actionData])

    const [popUp, setPopUp] = useState()

    return (
        <main className="d-flex flex-column justify-content-center align-items-center gap-2 p-5 rounded shadow-lg">
            <h2>Login</h2>
            <section>
                <Form method="post" className='d-flex flex-column gap-3'>
                    <div className='d-flex justify-content-between'>
                        <label htmlFor="name">Email: </label>
                        <input name="email" type="email" id="name gap-2" />
                    </div>
                    <div className='d-flex justify-content-between gap-2'>
                        <label htmlFor="password">Password: </label>
                        <input name="password" type="password" id="password" />
                    </div>
                    <Button>LOGIN</Button><NavLink className="ms-2" to="/registration">Register User</NavLink>
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