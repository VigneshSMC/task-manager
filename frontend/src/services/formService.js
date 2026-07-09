import { confirmSignUp, fetchAuthSession, signIn, signUp } from "aws-amplify/auth"
import { addTask, updateTask } from "../slice/TaskSlice"
import { addTaskAPI, updateTaskAPI } from "./taskService"
import { redirect, replace } from "react-router-dom"
import { addProject, updateProject } from "../slice/ProjectSlice"
import { addProjectAPI, updateProjectAPI } from "./projectService"
import { store } from "../store/store"
import { verifyUser } from "./authService"

const processData = async ({ request }) => {

    try {

        const formData = await request.formData()
        const intent = formData.get('intent')
        const error = {}

        const name = formData.get('name')?.toString().trim()
        const description = formData.get('description').toString().trim()
        const startDate = formData.get('startDate')
        const endDate = formData.get('endDate')

        if (!name) error.name = "project name cannot be empty"
        if (!description) error.description = "description cannot be empty"

        if (Object.keys(error).length > 0) return error

        const cleanedData = Object.fromEntries(formData)
        cleanedData.members = formData.getAll('members')
        console.log("cleanedData - members", cleanedData)

        if (intent == 'create') {
            const ret = await addProjectAPI(cleanedData)
            console.log("returned value - ", ret.data.project)
            if (ret) store.dispatch(addProject(ret.data.project))
            console.log("start")
            console.log("end")
            return { success: true }
        }
        else if (intent == 'update') {
            const id = formData.get('id')
            const ret = await updateProjectAPI(id, cleanedData)
            console.log("Inside projects - ", ret)
            console.log("update return", ret.data.data)
            if (ret) store.dispatch(updateProject(ret.data.data))
            return { success: true }
        }
    }
    catch (error) {
        return { success: false }
    }
}

const taskAction = async ({ request, params }) => {
    const { id } = params
    const formData = await request.formData()

    const error = {}

    const title = formData.get('title')?.toString().trim();
    const description = formData.get('description')?.toString().trim();
    const startDate = formData.get('startDate')
    const endDate = formData.get('endDate')

    if (!title) {
        error.title = "title cannot be empty"
    }
    if (!description) {
        error.description = "description cannot be empty"
    }
    if (startDate > endDate) error.date = "start date cannot be greater than end date"


    if (Object.keys(error).length > 0) return error

    const intent = formData.get('intent')
    const cleanedData = Object.fromEntries(formData)
    console.log("cleaned data", cleanedData)
    try {
        if (intent === 'create') {
            const ret = await addTaskAPI(id, cleanedData)
            console.log("return", ret.data)
            console.log("test", ret.data.task)
            if (ret) store.dispatch(addTask(ret.data.task))
            return {
                success: true
            }
        }

        if (intent === 'update') {
            const taskId = formData.get("taskId");
            const ret = await updateTaskAPI(id, taskId, cleanedData);
            console.log("return", ret.data.data)
            if (ret) store.dispatch(updateTask(ret.data.data));
            return { success: true };
        }

        return { success: false, message: "Invalid action intent." };
    }
    catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

const registerAction = async ({ request }) => {
    try {
        const formData = await request.formData()
        const { name, email, password, gender, intent, otp } = Object.fromEntries(formData)
        if (name === '') return { error: "name is required" }
        if (email === '') return { error: "email is required" }
        if (password === '') return { error: "password not entered" }

        console.log(email)

        if (intent === 'otp') {
            console.log("before")
            const result = await confirmSignUp({
                username: email,
                confirmationCode: otp

            })
            console.log("confirm sign up", result)
            return redirect("/")
        }

        else if (intent === 'signUp') {

            const result = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                        given_name: name,
                        gender
                    }
                }
            });

            console.log(result)
            if (!result?.isSignUpComplete && result?.nextStep?.signUpStep) return { otp: true }

            return redirect("/")
        }
    }
    catch (error) {
        console.log(error)
        return {
            error: error.message
        }
    }
}

const loginAction = async ({ request }) => {
    try {

        const user = await fetchAuthSession()
        if (user?.tokens?.accessToken) return redirect("/dashboard")

        const formData = await request.formData()
        const { intent, email, password, otp } = Object.fromEntries(formData)
        if (email === '') return { error: "email is required" }
        if (password === '') return { error: "password is required" }
        console.log(intent, email, password)

        if (intent === 'otp') {
            console.log("before")
            const result = await confirmSignUp({
                username: email,
                confirmationCode: otp

            })
            console.log("confirm sign up", result)
            return redirect("/")
        }

        else if (intent === 'login') {
            const result = await signIn({
                username: email,
                password
            })

            console.log(result)
            if (!result?.isSignedIn && result?.nextStep?.signInStep !== 'DONE') return { otp: true }
            else {
                const response = await verifyUser({ email, password })
                console.log("response", response)
            }

            return redirect("/dashboard")
        }
    }
    catch (error) {
        console.log(error.message)
        return {
            error: error.message
        }
    }
}

export { processData, taskAction, registerAction, loginAction }