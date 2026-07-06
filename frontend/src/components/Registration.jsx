import { Form, NavLink, redirect, useNavigate, useNavigation } from 'react-router-dom'
import { registerUser } from '../services/authService'
import { useEffect, useState } from 'react'
import { useActionData } from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap'
import { signUp } from 'aws-amplify/auth'

export default function Registration() {

    const actionData = useActionData()
    const navigation = useNavigation()

    const isSubmitting = navigation.state === 'submitting'

    const [otp, setOtp] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        setPopUp(true)
        setOtp(actionData?.otp ? true : false)
    }, [actionData])

    const [popUp, setPopUp] = useState()

    return (
        <main className="d-flex flex-column justify-content-center align-items-center 
        gap-2 p-5 rounded shadow-lg">
            <h2>Register</h2>
            <section>
                <Form method="post" className='d-flex flex-column gap-3'>
                    <div className='d-flex justify-content-between gap-2'>
                        <label htmlFor="name">Name: </label>
                        <input className='rounded border border-1 px-2 py-1' type="text" id='name' name='name' />
                    </div>
                    <div className='d-flex justify-content-between gap-2'>
                        <label htmlFor="gender">Gender: </label>
                        <input className='rounded border border-1 px-2 py-1' type="text" id='gender' name='gender' />
                    </div>
                    <div className='d-flex justify-content-between gap-2'>
                        <label htmlFor="email">Email: </label>
                        <input onChange={e => setEmail(e.target.value)} className='rounded border border-1 px-2 py-1' name="email" type="email" id="email" />
                    </div>
                    <div className='d-flex justify-content-between gap-2'>
                        <label htmlFor="password">Password: </label>
                        <input className='rounded border border-1 px-2 py-1' name="password" type="password" id="password" />
                    </div>
                    <Button name='intent' value='signUp' type='submit'>Register {isSubmitting && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}</Button><NavLink className="ms-2" to="/login">Login</NavLink>
                </Form>
                {actionData?.error && popUp && (
                    <div
                        className="position-absolute top-0 start-50 translate-middle-x mt-4 shadow-lg bg-danger text-white rounded p-3 d-flex align-items-center justify-content-between gap-4"
                        style={{ zIndex: 1050, minWidth: '300px', maxWidth: '500px' }}
                    >
                        <div className="d-flex align-items-center gap-2 m-0 fs-6">
                            <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                            <span className="fw-semibold">{actionData.error}</span>
                        </div>

                        <button
                            onClick={() => setPopUp(false)}
                            className="btn-close btn-close-white ms-auto shadow-none"
                            aria-label="Close"
                        ></button>
                    </div>
                )}</section>
            <Modal show={otp}>
                <Form method='post' className='p-4 d-flex flex-column'>
                    <input type="hidden" name="email" value={email} />
                    <Button onClick={() => setOtp(false)} className='ms-auto'>&times;</Button>
                    <input className="my-2 p-2" name='otp' placeholder='enter otp' />
                    <Button type='submit' name='intent' value='otp'>SUBMIT OTP</Button>
                </Form>
            </Modal>
        </main>
    )
}