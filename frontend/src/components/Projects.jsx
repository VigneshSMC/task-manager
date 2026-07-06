import { Suspense, useEffect, useState } from "react"
import { getProjectsAPI, deleteProjectAPI, addProjectAPI, updateProjectAPI } from "../services/projectService"
import { Form as RouterForm, useLoaderData, useActionData, Await } from "react-router-dom"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { deleteProject, addProject, updateProject } from "../slice/ProjectSlice"
import { store } from '../store/store'
import { useNavigate } from "react-router-dom"
import { getAllUsers } from "../services/userService"
import { Button, Card, Col, Container, Form, ListGroup, Modal, Row, Alert } from "react-bootstrap"
import { getCurrentUser } from "aws-amplify/auth"

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
        console.log("Users - ", users, project)
        setSelectedUsers(project.members)
        setUpdate({ proceed: true, project, users })
    }

    const updateSelectedMembers = (r) => {
        if (!selectedUsers.find(s => s._id == r._id)) setSelectedUsers([...selectedUsers, r])
        console.log("members updated", selectedUsers)
    }

    const removeSelectedMembers = (s) => {
        setSelectedUsers(selectedUsers.filter(d => d._id !== s._id))
    }

    const user = useSelector(state => state.user)
    console.log("inside project", user)

    const access = user.groups.some(u => !['manager', 'admin'].includes(u))

    return (
        <Container className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="border p-2 rounded bg-primary text-white">PROJECTS</h3>
                <Button disabled={access} className="addbutton" onClick={() => handleAdd()}>+</Button></div>
            <Row xs={2} md={3} lg={5} className="g-4 mb-4">
                {data.map(d => {
                    return (<Col key={d._id}>
                        <Card>
                            <Card.Header className="bg-primary pt-3 text-white d-flex justify-content-between align-items-start">
                                <Card.Title style={{ cursor: 'pointer' }} onClick={() => projectRedirect(d._id)}>{d.name}</Card.Title>
                                <Button disabled={access} variant="link" className="p-0 text-dark" onClick={() => handleUpdate(d)}>&#9998;</Button>
                            </Card.Header>
                            <Card.Body className="edit">
                                <Card.Text>{d.description}</Card.Text>
                                <h6 className="mt-3">Members: </h6>
                                <ListGroup horizontal className="d-flex flex-wrap gap-2">
                                    {d.members.map(m => (
                                        <ListGroup.Item key={m._id} className="p-2 border-2">
                                            {m.name}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                            <Card.Footer className="bg-transparent border-top-0 text-end">
                                <Button disabled={access} variant="outline-danger" size="sm" onClick={() => {
                                    deleteProjectAPI(d._id)
                                    dispatch(deleteProject(d._id))
                                }} >
                                    &times;
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    )
                })}
            </Row>
            <Modal size="sm" show={add.proceed}>
                <RouterForm method="post" onClick={() => setError(false)}>
                    <Modal.Header>
                        <Modal.Title>NEW PROJECT</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedUsers.map(s => <input key={s._id} type="hidden" name="members" value={s._id} />)}
                        <Form.Group className="mb-3">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control name="name" type="text" placeholder="enter project name" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control name="description" type="text" placeholder="enter description" />
                        </Form.Group>
                        <Button className="mb-3" variant="secondary" onClick={() => setSeeMembers(true)}>Add Members</Button>
                        <div className="mb-3">
                            <h6>Selected Members:</h6>
                            {selectedUsers.map(n => <span key={n._id} className="d-inline-flex align-items-center me-2 bg-light px-3 py-1 gap-3 border rounded">
                                <span>{n.name}</span><span style={{cursor: 'pointer'}} onClick={() => removeSelectedMembers(n)}>&times;</span></span>)}</div>
                        <Suspense>
                            <Await resolve={add.users}>
                                {resolved => (
                                    seeMembers &&
                                    <Card className="mb-3 bg-light" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                        <ListGroup variant="flush">
                                            {
                                                resolved?.map(r => (
                                                    <ListGroup.Item key={r._id} onClick={() =>
                                                        updateSelectedMembers(r)} style={{ cursor: 'pointer' }}> {r.name} -- {r.email}
                                                    </ListGroup.Item>
                                                ))
                                            }
                                        </ListGroup>
                                    </Card>
                                )}
                            </Await>
                        </Suspense>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {setAdd({ proceed: false }); setSeeMembers(false)}}>
                            Close
                        </Button>
                        <Button variant="primary" name="intent" value="create" type="submit">
                            ADD
                        </Button>
                    </Modal.Footer>
                </RouterForm>
            </Modal>
            {error && actionData?.message &&
                <div className="error"><p>{actionData.message}</p></div>}

            <Modal size="sm" show={update.proceed} onHide={() => setUpdate({proceed: false})}>
                <RouterForm className="update" method="post" onClick={() => setError(false)}>
                    <Modal.Header>
                        <Modal.Title>UPDATE PROJECT</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedUsers.map(s => <input key={s._id} type="hidden" name="members" value={s._id} />)}
                        <input type="hidden" name="id" value={update.project ? update.project._id : ''} />
                        <Form.Group className="mb-3">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control defaultValue={update.project ? update.project.name : ''} name="name" type="text" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control defaultValue={update.project ? update.project.description : ''} name="description" type="text" />
                        </Form.Group>
                        <Button onClick={() => setSeeMembers(true)}>Add Members</Button>
                        <div className="my-2">
                            <h6>Selected Members: </h6>
                            {selectedUsers.map(n => <span key={n._id} className="d-inline-flex align-items-center me-2 bg-light px-3 py-1 gap-3 border rounded">
                                <span>{n.name}</span><span style={{cursor: 'pointer'}} onClick={() => removeSelectedMembers(n)}>&times;</span></span>)}
                        </div>
                        <Suspense>
                            <Await resolve={update.users}>
                                {resolved => (
                                    seeMembers && <Card className="mb-3 bg-light" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                        <ListGroup onChange={() => def()} name="users" id="users">
                                            {resolved?.map(r => (
                                                <ListGroup.Item key={r._id} onClick={() => updateSelectedMembers(r)} style={{ cursor: 'pointer' }}>
                                                    {r.name} -- {r.email}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card>
                                )}
                            </Await>
                        </Suspense>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {setUpdate({ proceed: false }); setSeeMembers(false)}}>Close</Button>
                        <Button variant="primary" name="intent" value="update" type="submit">UPDATE</Button>
                    </Modal.Footer>
                </RouterForm>
            </Modal>
        </Container>
    )
}

export default Projects;