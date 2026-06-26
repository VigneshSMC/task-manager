import { createBrowserRouter, Navigate, redirect } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Projects, { addProjectData } from "./components/Projects";
import { getProjectsAPI } from "./services/projectService";
import { store } from './store/store'
import { addProjects } from "./slice/ProjectSlice";
import { addTasks } from "./slice/TaskSlice";
import Tasks, { addTaskData } from "./components/Tasks";
import Login, { loginAction } from "./components/Login";
import RootPage from "./pages/RootPage";
import Registration, { registerAction } from "./components/Registration";
import { getTasksAPI } from "./services/taskService";

const router = createBrowserRouter([
    {path: "/", element: <RootPage/>, loader: () => {
        localStorage.clear()
    }, children: [
        {index: true, element: <Navigate to="login"/>},
        {path: "login", element: <Login/>, action: loginAction},
        {path: "Registration", element: <Registration/>, action: registerAction}
    ]},
    {path: "/dashboard", element: <Dashboard />, loader: () => {
        if (!localStorage.getItem('token')) {
            throw redirect("/")
        }
        return null
    }, children: [
        {index: true, element: <Navigate to="projects"/>},
        {path: "projects", element: <Projects/>, action: addProjectData, loader: async () => {
            const data = await getProjectsAPI()
            store.dispatch(addProjects(data.body))
            return data
        }}
    ]
    },
    {path: "/dashboard/projects/:id/tasks", element: <Tasks />, action: addTaskData, loader: async ({params}) => {
        const id = params.id
        console.log(id)
        const data = await getTasksAPI(id)
        console.log(data)
        store.dispatch(addTasks(data.body))
        return data
    }}
])

export { router };