import { createBrowserRouter, Navigate, redirect } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Projects, { addProjectData } from "./components/Projects";
import { getProjectsAPI } from "./services/projectService";
import { store } from './store/store'
import { addProjects } from "./slice/ProjectSlice";
import { addTasks } from "./slice/TaskSlice";
import Tasks, { taskAction } from "./components/Tasks";
import Login, { loginAction } from "./components/Login";
import RootPage from "./pages/RootPage";
import Registration, { registerAction } from "./components/Registration";
import { getTasksAPI } from "./services/taskService";

const router = createBrowserRouter([
    {
        path: "/", element: <RootPage />, loader: () => {
            localStorage.clear()
        }, children: [
            { index: true, element: <Navigate to="login" replace /> },
            { path: "login", element: <Login />, action: loginAction },
            { path: "Registration", element: <Registration />, action: registerAction }
        ]
    },
    {
        path: "/dashboard", element: <Dashboard />, loader: () => {
            if (!localStorage.getItem('token')) {
                throw redirect("/")
            }
            return null
        }, children: [
            { index: true, element: <Navigate to="projects" /> },
            {
                path: "projects", element: <Projects />, action: addProjectData, loader: async () => {
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
        path: "/dashboard/projects/:id/tasks", element: <Tasks />, action: taskAction, loader: async ({ params }) => {
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
    }
])

export { router };