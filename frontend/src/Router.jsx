import { createBrowserRouter, Navigate, redirect, useNavigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Projects from "./components/Projects";
import { getProjectsAPI } from "./services/projectService";
import { store } from './store/store'
import { addProjects } from "./slice/ProjectSlice";
import { addTasks } from "./slice/TaskSlice";
import { addUser } from "./slice/UserSlice";
import Tasks from "./components/Tasks";
import Login from "./components/Login";
import RootPage from "./pages/RootPage";
import Registration from "./components/Registration";
import { getTasksAPI } from "./services/taskService";
import { processData, taskAction, registerAction, loginAction } from "./services/formService";

import { Amplify } from 'aws-amplify';

import { fetchAuthSession, signOut, signInWithRedirect, getCurrentUser } from 'aws-amplify/auth'
import RequireAuth from "./components/RequireAuth";

const router = createBrowserRouter([
    {
        path: "/", element: <RootPage />, hydrateFallbackElement: <></>, children: [
            { index: true, element: <Navigate to="login" /> },
            { path: "login", element: <Login />, action: loginAction },
            { path: "registration", element: <Registration />, action: registerAction }
        ]
    },
    {
        path: "/dashboard", element: <RequireAuth><Dashboard /></RequireAuth>, children: [
            { index: true, element: <Navigate to="projects" /> },
            {
                path: "projects", element: <RequireAuth><Projects /></RequireAuth>, action: processData, loader: async () => {

                    const allProjects = store.getState().projects
                    console.log(allProjects)
                    if (allProjects && allProjects.length > 0) {
                        console.log("loaded from redux - ", allProjects)
                        return allProjects
                    }
                    const data = await getProjectsAPI()
                    store.dispatch(addProjects(data?.body))
                    console.log("loaded through api - ", data?.body)
                    return data?.body
                }
            }
        ]
    },
    {
        path: "/dashboard/projects/:id/tasks", element: <RequireAuth><Tasks /></RequireAuth>, action: taskAction, loader: async ({ params }) => {
            const id = params.id
            console.log(id)

            const currentState = store.getState().tasks
            const userTasks = currentState.filter(t => t.project_id == id)
            if (userTasks && userTasks.length > 0) {
                console.log("loaded from redux - ", currentState)
                return userTasks
            }
            const data = await getTasksAPI(id)
            console.log("loaded through api")
            store.dispatch(addTasks(data?.body))
            return data
        }
    },
    { path: "*", element: <div className="d-flex flex-column align-items-center pt-5"><h1 className="text-white bg-danger p-5 rounded">PAGE NOT FOUND</h1></div> }
])

export { router };