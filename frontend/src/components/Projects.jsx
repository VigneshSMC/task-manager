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
        setValidation({ ...actionData })
        if (actionData?.success) {
            console.log("validation", validation)
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
    const [validation, setValidation] = useState()

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

    const LightLabel = ({ children, ...props }) => (
        <Form.Label className="fw-light" {...props}>
            {children}
        </Form.Label>
    )

    const NA = ({ children, ...props }) => (
        <span className="text-warning fw-lighter">NA</span>
    )

    return (
        <Container className="container py-3">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="border p-2 rounded text-primary fw-normal">PROJECTS</h3>
                { !access && <Button className="addbutton" onClick={() => handleAdd()}>+</Button> } </div>
            <Row xs={2} md={3} lg={5} className="g-2 mb-4 border border-1 rounded p-5">
                {data.map(d => {
                    return (<Col key={d._id}>
                        <Card>
                            <Card.Header className="bg-primary pt-3 text-white d-flex gap-2 align-items-center justify-content-between">
                                <Card.Title style={{ cursor: 'pointer' }} onClick={() => projectRedirect(d._id)}>{d?.name}</Card.Title>
                                {!access &&
                                    <Button variant="link" className="p-0 text-dark" onClick={() => handleUpdate(d)}>&#9998;</Button>}
                            </Card.Header>
                            <Card.Body className="p-3 pb-0">
                                <Card.Text className="fw-light">{d?.description}</Card.Text>
                                <Card.Text className="d-flex justify-content-between">
                                    <span className="fw-light">Start Date</span>
                                    <span>{d?.startDate ? d?.startDate.substring(0, 10) : <NA />}</span>
                                </Card.Text>
                                <Card.Text className="d-flex justify-content-between">
                                    <span className="fw-light">End Date</span>
                                    <span>{d?.endDate ? d?.endDate.substring(0, 10) : <NA />}</span>
                                </Card.Text>
                                <h6 className="mt-3 fw-normal">Members: </h6>
                                <ListGroup horizontal className="d-flex flex-wrap gap-1">
                                    {d.members.map(m => (
                                        <ListGroup.Item key={m._id} className="p-1 px-2 border-1 fw-light">
                                            {m.name}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                            <Card.Footer className="bg-transparent border-top-0 text-end p-0 mt-2 mb-3 me-3">
                                {!access && <Button variant="outline-danger" size="sm" onClick={() => {
                                    deleteProjectAPI(d._id)
                                    dispatch(deleteProject(d._id))
                                }} >
                                    &times;
                                </Button>}
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
                            <LightLabel>Project Name</LightLabel>
                            <Form.Control onFocus={() => setValidation(prev => ({ ...prev, name: '' }))} name="name" type="text" placeholder="enter project name" />
                            {validation?.name && <h6 className="fs-6 text-danger">{validation?.name}</h6>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <LightLabel className="fw-light">Description</LightLabel>
                            <Form.Control onFocus={() => setValidation(prev => ({ ...prev, description: '' }))} name="description" type="text" placeholder="enter description" />
                            {validation?.description && <h6 className="fs-6 text-danger">{validation?.description}</h6>}
                        </Form.Group>
                        <hr />
                        <Form.Group>
                            <LightLabel htmlFor="startDate">Start Date</LightLabel>
                            <Form.Control name="startDate" id="startDate" type="date" className="mb-3" />
                            <LightLabel htmlFor="endDate" className="m-0 ms-1 fw-light">End Date</LightLabel>
                            <Form.Control name="endDate" id="endDate" type="date" />
                        </Form.Group>
                        <hr />
                        <Button className="mb-3" variant="secondary" onClick={() => setSeeMembers(true)}>Add Members</Button>
                        <div className="mb-3">
                            <h6>Selected Members:</h6>
                            {selectedUsers.map(n => <span key={n._id} className="d-inline-flex align-items-center me-2 bg-light px-3 py-1 gap-3 border rounded">
                                <span>{n.name}</span><span style={{ cursor: 'pointer' }} onClick={() => removeSelectedMembers(n)}>&times;</span></span>)}</div>
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
                        <Button variant="secondary" onClick={() => { setAdd({ proceed: false }); setSeeMembers(false); setValidation({}) }}>
                            Close
                        </Button>
                        <Button variant="primary" name="intent" value="create" type="submit">
                            ADD
                        </Button>
                    </Modal.Footer>
                </RouterForm>
            </Modal>

            <Modal size="sm" show={update.proceed} onHide={() => setUpdate({ proceed: false })}>
                <RouterForm className="update" method="post" onClick={() => setError(false)}>
                    <Modal.Header>
                        <Modal.Title>UPDATE PROJECT</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedUsers.map(s => <input key={s._id} type="hidden" name="members" value={s._id} />)}
                        <input type="hidden" name="id" value={update.project ? update.project._id : ''} />
                        <Form.Group className="mb-3">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control onFocus={() => setValidation(prev => ({ ...prev, name: '' }))} defaultValue={update.project ? update.project.name : ''} name="name" type="text" />
                            {validation?.name && <h6 className="fs-6 text-danger">{validation?.name}</h6>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control onFocus={() => setValidation(prev => ({ ...prev, description: '' }))} defaultValue={update.project ? update.project.description : ''} name="description" type="text" />
                            {validation?.description && <h6 className="fs-6 text-danger">{validation?.description}</h6>}
                        </Form.Group>
                        <Form.Group>
                            <LightLabel htmlFor="startDate">Start Date</LightLabel>
                            <Form.Control defaultValue={update.project ? update.project.startDate?.substring(0, 10) : ''}
                                name="startDate" id="startDate" type="date" className="mb-3" />
                            <LightLabel htmlFor="endDate" className="m-0 ms-1 fw-light">End Date</LightLabel>
                            <Form.Control defaultValue={update.project ? update.project.endDate?.substring(0, 10) : ''} name="endDate" id="endDate" type="date" />
                        </Form.Group>
                        <hr />
                        <Button onClick={() => setSeeMembers(true)}>Add Members</Button>
                        <div className="my-2">
                            <h6>Selected Members: </h6>
                            {selectedUsers.map(n => <span key={n._id} className="d-inline-flex align-items-center me-2 bg-light px-3 py-1 gap-3 border rounded">
                                <span>{n.name}</span><span style={{ cursor: 'pointer' }} onClick={() => removeSelectedMembers(n)}>&times;</span></span>)}
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
                        <Button variant="secondary" onClick={() => { setUpdate({ proceed: false }); setSeeMembers(false); setValidation() }}>Close</Button>
                        <Button variant="primary" name="intent" value="update" type="submit">UPDATE</Button>
                    </Modal.Footer>
                </RouterForm>
            </Modal>
        </Container>
    )
}

export default Projects;