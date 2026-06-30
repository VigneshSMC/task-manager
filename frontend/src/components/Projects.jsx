import { useEffect, useState } from "react"
import { getProjectsAPI, deleteProjectAPI, addProjectAPI } from "../services/projectService"
import { useLoaderData, Form, useActionData } from "react-router-dom"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { deleteProject, addProject } from "../slice/ProjectSlice"
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
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(true)
    }, [actionData])

    return (
        <main className="projectview">
            <section className="projects">
                <div className="headerside"><h2>PROJECTS</h2>
                    <div className="addbutton" onClick={() => setAdd(true)}>+</div></div>
                <ul>
                    {data.map((d, i) => {
                        return (<li key={i}>
                            <div className="projectitem" onClick={() => projectRedirect(d._id)}>
                                <h3>{d.name}</h3>
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
                <button>ADD</button>
            </Form>}
            {error && actionData?.message &&
                <div className="error"><p>{actionData.message}</p></div>}
        </main>
    )
}

export const addProjectData = async ({ request }) => {
    const formData = await request.formData()
    if (formData.get('name') == '' || formData.get('description') == '') {
        return { message: "name/description cannot be empty" }
    }
    const cleanedPost = Object.fromEntries(formData)
    const ret = await addProjectAPI(cleanedPost)
    console.log("returned value - ", ret.data.project)
    if (ret) store.dispatch(addProject(ret.data.project))
}

export default Projects;