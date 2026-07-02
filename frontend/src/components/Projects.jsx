import { Suspense, useEffect, useState } from "react"
import { getProjectsAPI, deleteProjectAPI, addProjectAPI, updateProjectAPI } from "../services/projectService"
import { useLoaderData, Form, useActionData, Await } from "react-router-dom"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { deleteProject, addProject, updateProject } from "../slice/ProjectSlice"
import { store } from '../store/store'
import { useNavigate } from "react-router-dom"
import { getAllUsers } from "../services/userService"

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

    const [add, setAdd] = useState({ proceed: false })
    const [update, setUpdate] = useState({ proceed: false })
    const [error, setError] = useState(false)

    useEffect(() => {
        if (actionData?.success) {
            setUpdate({ proceed: false });
            setAdd({ proceed: false })
            setSeeMembers(false)
        }
        setError(true)
    }, [actionData])


    const handleAdd = () => {
        const users = getAllUsers()
        setSelectedUsers([])
        setAdd({ proceed: true, users })
    }

    const [seeMembers, setSeeMembers] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])

    const handleUpdate = (project) => {
        const users = getAllUsers()
        console.log("Users - ", users)
        setSelectedUsers(project.members)
        setUpdate({ proceed: true, project, users })
    }

    const updateSelectedMembers = (r) => {
        if (!selectedUsers.find(s => s._id == r._id)) setSelectedUsers([...selectedUsers, r])
        console.log("members updated", selectedUsers)
    }

    return (
        <main className="projectview">
            <section className="projects">
                <div className="headerside"><h2>PROJECTS</h2>
                    <div className="addbutton" onClick={() => handleAdd()}>+</div></div>
                <ul>
                    {data.map(d => {
                        return (<li key={d._id}>
                            <div className="projectitem">
                                <div className="edit"><h3 onClick={() => projectRedirect(d._id)}>{d.name}</h3>
                                    <h3 onClick={() => handleUpdate(d)}>&#9998;</h3></div>
                                <p>{d.description}</p>
                                <h3>Members: </h3>{d.members.map(m => (<p>{m.name}</p>))}
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
            {add.proceed && <Form method="post" onClick={() => setError(false)}>
                {selectedUsers.map(s => <input key={s._id} type="hidden" name="members" value={s._id} />)}
                <h2>NEW PROJECT</h2>
                <span onClick={() => setAdd({ proceed: false })} className="close">&times;</span>
                <input name="name" type="text" placeholder="name" />
                <input name="description" type="text" placeholder="description" />
                <button htmlFor="users" onClick={() => setSeeMembers(true)}>add members</button>
                <Suspense>
                    <Await resolve={add.users}>
                        {resolved => (
                            seeMembers && <div className="addmembers">
                                <div onClick={() => setSeeMembers(false)}>&times;</div>
                                <ul name="users" id="users">
                                    {resolved.map(r => (
                                        <div key={r._id}><li onClick={() =>
                                            updateSelectedMembers(r)} name={r._id} value={r._id}>{r.name} -- {r.email}</li><hr /></div>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Await>
                </Suspense>
                <div className="memberlist">{selectedUsers.map(n => <span key={n._id}>{n.name} <br /></span>)}</div>
                <button name="intent" value="create">ADD</button>
            </Form>}
            {error && actionData?.message &&
                <div className="error"><p>{actionData.message}</p></div>}

            {update.proceed && <Form className="update" method="post" onClick={() => setError(false)}>
                <span className="close" onClick={() => setUpdate({ proceed: false })}>&times;</span>
                <h2>UPDATE PROJECT</h2>
                {selectedUsers.map(s => <input type="hidden" name="members" value={s._id} />)}
                <input type="hidden" name="id" value={update.project._id} />
                <label htmlFor="name">Project Name</label>
                <input defaultValue={update.project.name} id="name" name="name" type="text" placeholder="name" />
                <label htmlFor="description">Description</label>
                <input defaultValue={update.project.description} id="name" name="description" type="text" placeholder="description" />
                <button htmlFor="users" onClick={() => setSeeMembers(true)}>add members</button>
                <Suspense>
                    <Await resolve={update.users}>
                        {resolved => (
                            seeMembers && <div className="addmembers">
                                <div onClick={() => setSeeMembers(false)}>&times;</div>
                                <ul onChange={() => def()} name="users" id="users">
                                    {resolved.map(r => (
                                        <div key={r._id}><li onClick={() => updateSelectedMembers(r)} name={r._id} value={r._id}>{r.name} -- {r.email}</li><hr /></div>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Await>
                </Suspense>
                <div className="memberlist">{selectedUsers.map(n => <span key={n._id}>{n.name} <br /></span>)}</div>
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

export default Projects;