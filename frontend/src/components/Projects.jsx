import { useEffect, useState } from "react"
import { getProjectsAPI, deleteProjectAPI, addProjectAPI, updateProjectAPI } from "../services/projectService"
import { useLoaderData, Form, useActionData } from "react-router-dom"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { deleteProject, addProject, updateProject } from "../slice/ProjectSlice"
import { store } from '../store/store'
import { useNavigate } from "react-router-dom"

const Projects = () => {

    const data = useSelector(state => state.projects)
    const navigate = useNavigate()
    console.log(data)
    const dispatch = useDispatch()
    const projectRedirect = (id) => {
        console.log(id)
        navigate(`/dashboard/projects/${id}/tasks`)
    }

    const actionData = useActionData()
    console.log(actionData)

    const [add, setAdd] = useState()
    const [update, setUpdate] = useState({ proceed: false })
    const [error, setError] = useState(false)

    useEffect(() => {
        if (actionData?.success) {
            setUpdate({proceed: false});
            setAdd(false)
        }
        setError(true)
    }, [actionData])

    const updateProject = (project) => {
        setUpdate({ proceed: true, project })
    }

    return (
        <main className="projectview">
            <section className="projects">
                <div className="headerside"><h2>PROJECTS</h2>
                    <div className="addbutton" onClick={() => setAdd(true)}>+</div></div>
                <ul>
                    {data.map((d, i) => {
                        return (<li key={i}>
                            <div className="projectitem">
                                <div className="edit"><h3 onClick={() => projectRedirect(d._id)}>{d.name}</h3><h3 onClick={() => updateProject(d)}>&#9998;</h3></div>
                                <p>{d.description}</p>
                            </div>
                            <h4 onClick={() => {
                                deleteProjectAPI(d._id)
                                dispatch(deleteProject(d._id))
                            }}>&times;</h4>
                        </li>
                        )
                    })}
                </ul>
            </section>
            {add && <Form method="post" onClick={() => setError(false)}>
                <h2>NEW PROJECT</h2>
                <span onClick={() => setAdd(false)} className="close">&times;</span>
                <input name="name" type="text" placeholder="name" />
                <input name="description" type="text" placeholder="description" />
                <button name="intent" value="create">ADD</button>
            </Form>}
            {error && actionData?.message &&
                <div className="error"><p>{actionData.message}</p></div>}

            {update.proceed && <Form method="post" onClick={() => setError(false)}>
                <h2>UPDATE PROJECT</h2>
                <input type="hidden" name="id" value={update.project._id} />
                <span className="close" onClick={() => setUpdate({ proceed: false })}>&times;</span>
                <input defaultValue={update.project.name} name="name" type="text" placeholder="name" />
                <input defaultValue={update.project.description} name="description" type="text" placeholder="description" />
                <button name="intent" value="update">UPDATE</button>
            </Form>}
        </main>
    )
}

export const addProjectData = async ({ request }) => {

    try {

        const formData = await request.formData()
        const intent = formData.get('intent')
        if (formData.get('name') == '' || formData.get('description') == '') {
            return { message: "name/description cannot be empty" }
        }
        const cleanedData = Object.fromEntries(formData)

        if (intent == 'create') {
            const ret = await addProjectAPI(cleanedData)
            console.log("returned value - ", ret.data.project)
            if (ret) store.dispatch(addProject(ret.data.project))
            return { success: true }
        }
        else if (intent == 'update') {
            const id = formData.get('id')
            const ret = await updateProjectAPI(id, cleanedData)
            console.log("Inside projects - ", ret)
            console.log("update return", ret.data.data)
            if (ret) store.dispatch(updateProject(ret.data.data))
            return { success: true}
        }
    }
    catch (error) {
        return { success: false }
    }
}

export default Projects;