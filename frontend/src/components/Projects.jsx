import { useState } from "react"
import { getProjectsAPI, deleteProjectAPI, addProjectAPI } from "../services/projectService"
import { useLoaderData, Form } from "react-router-dom"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { deleteProject } from "../slice/ProjectSlice"
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

    return (
        <section className="projects">
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
                        }}>DEL</h4>
                    </li>
                    )
                })}
            </ul>
            <Form method="post">
                <input name="name" type="text" placeholder="name"/>
                <input name="description" type="text" placeholder="description"/>
                <button>ADD</button>
            </Form>
        </section>
    )
}

export const addProjectData = async ({request}) => {
    const formData = await request.formData()
    const cleanedPost = Object.fromEntries(formData)
    const ret = await addProjectAPI(cleanedPost)
    if (ret) store.dispatch(addProject(ret))
}

export default Projects;