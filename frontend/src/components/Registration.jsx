import { Form, redirect } from 'react-router-dom'
import { registerUser } from '../services/authService'
import { useEffect, useState } from 'react'
import { useActionData } from 'react-router-dom'

export default function Registration() {

    const actionData = useActionData()
    console.log(actionData?.error)

    useEffect(() => {
        setPopUp(true)
    }, [actionData])

    const [popUp, setPopUp] = useState()

    return (
        <main className="login">
            <h2>Registration</h2>
            <section>
                <Form method="post">
                    <div>
                        <label htmlFor="name">Name: </label>
                        <input type="text" id='name' name='name' />
                    </div>
                    <div>
                        <label htmlFor="email">Email: </label>
                        <input name="email" type="email" id="email" />
                    </div>
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input name="password" type="password" id="password" />
                    </div>
                    <button>Register</button>
                </Form>
                {actionData?.error && popUp && <span className='error'><h4>{actionData.error}</h4><h3 onClick={() => setPopUp(false)} className='close'>&times;</h3></span>}
            </section>
        </main>
    )
}

const registerAction = async ({ request }) => {
    try {
        const formData = await request.formData()
        const cleanedData = Object.fromEntries(formData)
        const response = await registerUser(cleanedData)
        return redirect("/login")
    }
    catch (error) {
        console.log(error)
        return {
            error: error.response?.data?.error
        }
    }
}

export { registerAction }