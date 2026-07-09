import { useSelector } from "react-redux"
import { useActionData, useLocation, useNavigate } from "react-router-dom"
import { Form as RouterForm, redirect, useParams } from "react-router-dom"
import { addTaskAPI, deleteTaskAPI, updateTaskAPI } from "../services/taskService"
import { useDispatch } from "react-redux"
import { addTask, deleteTask, updateTask } from "../slice/TaskSlice"
import { store } from '../store/store'
import { useEffect, useState } from "react"
import { Badge, Button, Card, Col, Container, Form, ListGroup, Modal, Row } from "react-bootstrap"
import { getProjectAPI } from "../services/projectService"

export default function Tasks() {

    const tasks = useSelector(state => state.tasks)
    const projects = useSelector(state => state.projects)

    console.log("tasks", tasks)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    console.log(tasks)
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState({
        proceed: false
    })
    const [project, setProject] = useState()
    const actionData = useActionData()
    const params = useParams()

    const [member, setMember] = useState(false)
    const [assignUser, setAssignUser] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUser, setSelectedUser] = useState('')
    const [validation, setValidation] = useState()

    useEffect(() => {
        setValidation({ ...actionData })
        console.log("validation", validation)
        if (actionData?.success) {
            setAdd(false)
            setEdit({ proceed: false, task: null })
            setAssignUser(false)
        }
    }, [actionData])

    const update = (d) => {
        setEdit({ proceed: !edit.proceed, task: d })
    }

    const loadMembers = async () => {
        const current = await getProjectAPI(params.id)
        setProject(await current.data?.project)
        console.log("Project", project)
    }

    const filteredusers = project?.members?.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    console.log("filtered users", filteredusers)

    const user = useSelector(state => state.user)
    const access = user?.groups?.some(u => !['manager', 'admin'].includes(u))

    const current = projects.find(p => p._id == params.id)
    console.log("current project", current)

    return (
        <div >
            <div className="d-flex bg-primary rounded m-2 mb-4 align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <Button className="border-2 bg-white text-primary 
                    rounded-5 ms-2 d-flex align-items-center justify-content-center"
                        style={{ width: "30px", height: "30px" }} onClick={() => navigate(-1)}>&larr;</Button>
                    <h1 className="bg-primary fs-5 ps-1 m-2 rounded fw-semibold text-white">TASKS</h1>
                </div>
                <h1 className="fs-5 pe-4 text-white m-0">{current.name}</h1>
            </div>
            <Container >
                <div className="d-flex justify-content-between mb-3">
                    <Button className="ms-auto" onClick={() => { loadMembers(); setAdd(true); setSelectedUser('') }}>+</Button>
                    <Button className="ms-2" onClick={() => { loadMembers(); setMember(true); }}>members</Button>
                </div>
                {tasks.length == 0 ? <h2 className="text-center text-primary mt-5">NO TASKS AVAILABLE</h2> :
                    <Row xs={2} md={3} lg={5} className="g-2 mt-4 border border-1 rounded p-5">
                        {tasks.map((d, i) => {
                            return (<Col key={i}>
                                <Card>
                                    <Card.Header className="d-flex justify-content-between align-items-center w-100 pb-1 bg-primary">
                                        <Card.Title className="text-white">{d.title}</Card.Title>
                                        <Button variant="link text-black" style={{ cursor: 'pointer' }} className="" onClick={() => { loadMembers(); update(d); setSelectedUser(d?.assignee) }}>&#9998;</Button>
                                    </Card.Header>
                                    <Card.Body className="p-3 pb-0">
                                        <Card.Text>{d.description}</Card.Text>
                                        <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                                            <span className="small text-secondary fw-semibold">Priority:</span>
                                            <Badge bg={d.priority === 'high' ? 'danger' : d.priority === 'medium' ? 'warning' : 'secondary'} size="sm">
                                                {d.priority}
                                            </Badge>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                                            <span className="small text-secondary fw-semibold">Status:</span>
                                            <Badge bg={d.status === 'done' ? 'success' : d.status === 'in progress' ? 'info' : d.status === 'under review' ? 'info' : 'dark'} className="text-capitalize">
                                                {d.status}
                                            </Badge>
                                        </div>

                                        <div className="border-top pt-2 mt-2 d-flex align-items-center justify-content-between small text-muted">
                                            <span className="fw-semibold">Assigned To:</span>
                                            <span className="text-dark fw-medium">{d.assignee ? d.assignee?.name : 'NONE'}</span>
                                        </div>

                                    </Card.Body>
                                    <Card.Footer className="border-top-0 bg-transparent text-end p-0 m-3 ms-0">
                                        <Button disabled={access} variant="outline-danger" onClick={() => {
                                            deleteTaskAPI(d.project_id, d._id)
                                            dispatch(deleteTask(d._id))
                                        }}>&times;</Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                            )
                        })}
                    </Row>
                }
                <Modal size="sm" show={add}>
                    <RouterForm method="post">
                        <Modal.Header>
                            <Modal.Title className="text-primary">NEW TASK</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control onFocus={() => setValidation(prev => ({ ...prev, title: '' }))} name="title" type="text" placeholder="enter title" />
                                {validation?.title && <h6 className="fs-6 text-danger">{validation?.title}</h6>}
                            </Form.Group>
                            <hr />
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Description
                                </Form.Label>
                                <Form.Control onFocus={() => setValidation(prev => ({ ...prev, description: '' }))} name="description" type="text" placeholder="enter description" />
                                {validation?.description && <h6 className="fs-6 text-danger">{validation?.description}</h6>}
                            </Form.Group>
                            <hr />
                            <Button size="sm" className="d-inline-flex mb-3" onClick={() => { setAssignUser(prev => !prev) }}>ASSIGN USER </Button>
                            {selectedUser && <div><p className="d-inline-flex">Assigned to:</p>
                                <span className="d-inline ms-2">{selectedUser?.name}</span>
                                <input type="hidden" name="assignee" value={selectedUser?._id} /></div>}
                            {assignUser && (<Card>
                                <Form.Control type="text" placeholder="search members" className="mb-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></Form.Control>
                                <ListGroup style={{ overflowY: 'auto', maxHeight: '150px', cursor: 'pointer' }}>
                                    {filteredusers?.map(u => {
                                        return (
                                            <ListGroup.Item onClick={() => { setAssignUser(false); setSelectedUser(u) }} key={u._id}>
                                                {u.name}
                                            </ListGroup.Item>
                                        )
                                    })}
                                </ListGroup>
                            </Card>)}
                            <hr />
                            <fieldset className="mb-3">
                                <p className="mb-0">Priority</p>
                                <div className="d-flex gap-2">
                                    <label htmlFor="low">Low</label>
                                    <input defaultChecked value="low" id="low" name="priority" type="radio" />
                                    <label htmlFor="medium">Medium</label>
                                    <input value="medium" id="medium" name="priority" type="radio" />
                                    <label htmlFor="high">High</label>
                                    <input value="high" id="high" name="priority" type="radio" />
                                </div>
                            </fieldset>
                            <select className="border border-1 p-2 rounded" name="status">
                                <option value="to do">TO DO</option>
                                <option value="in progress">IN PROGRESS</option>
                                <option value="under review">UNDER REVIEW</option>
                                <option value="done">DONE</option>
                            </select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => { setAdd(false); setAssignUser(false); setValidation() }}>Close</Button>
                            <Button name="intent" value="create" type="submit">ADD</Button>
                        </Modal.Footer>
                    </RouterForm>
                </Modal>
                <Modal size="sm" show={edit.proceed}>
                    <RouterForm method="post" key={edit.task ? edit.task._id : ''}>
                        <input type="hidden" name="taskId" value={edit.task ? edit.task._id : ''} />
                        <Modal.Header>
                            <Modal.Title className="text-primary">EDIT TASK</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control onFocus={() => setValidation(prev => ({ ...prev, title: '' }))} defaultValue={edit.task ? edit.task.title : ''} name="title" type="text" placeholder="enter title" />
                                {validation?.title && <h6 className="fs-6 text-danger">{validation?.title}</h6>}
                            </Form.Group>
                            <hr />
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control onFocus={() => setValidation(prev => ({ ...prev, description: '' }))} defaultValue={edit.task ? edit.task.description : ''} name="description" type="text" placeholder="enter description" />
                                {validation?.description && <h6 className="fs-6 text-danger">{validation?.description}</h6>}
                            </Form.Group>
                            <hr />
                            <Button size="sm" className="d-inline-flex mb-1" onClick={() => { setAssignUser(prev => !prev) }}>UPDATE USER</Button>
                            {selectedUser && <div><p className="d-inline-flex">Assigned to:</p>
                                <span className="d-inline ms-2">{selectedUser?.name}</span>
                                <input type="hidden" name="assignee" value={selectedUser?._id} /></div>}
                            <input type="hidden" name="assignee" value={selectedUser?._id} />
                            {assignUser && (<Card>
                                <Form.Control type="text" placeholder="search members" className="mb-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></Form.Control>
                                <ListGroup style={{ overflowY: 'auto', maxHeight: '150px', cursor: 'pointer' }}>
                                    {filteredusers?.map(u => {
                                        return (
                                            <ListGroup.Item onClick={() => { setAssignUser(false); setSelectedUser(u); }} key={u._id}>
                                                {u.name}
                                            </ListGroup.Item>
                                        )
                                    })}
                                </ListGroup>
                            </Card>)}
                            <hr />
                            <Form.Group onFocus={() => setValidation(prev => ({ ...prev, date: '' }))} className="mb-2">
                                <Form.Label className="m-0">Start Date</Form.Label>
                                <Form.Control name="startDate" type="date"></Form.Control>
                            </Form.Group>
                            <Form.Group onFocus={() => setValidation(prev => ({ ...prev, date: '' }))}>
                                <Form.Label className="m-0">End Date</Form.Label>
                                <Form.Control name="endDate" type="date"></Form.Control>
                            </Form.Group>
                            {validation?.date && <h6 className="fs-6 text-danger">{validation?.date}</h6>}
                            <hr />
                            <fieldset className="mb-3">
                                <p className="m-0">Priority</p>
                                <div className="d-flex gap-2">
                                    <label htmlFor="low">Low</label>
                                    <input defaultChecked value="low" id="low" name="priority" type="radio" />
                                    <label htmlFor="medium">Medium</label>
                                    <input value="medium" id="medium" name="priority" type="radio" />
                                    <label htmlFor="high">High</label>
                                    <input value="high" id="high" name="priority" type="radio" />
                                </div>
                            </fieldset>
                            <select className="border border-1 p-2 rounded" defaultValue={edit.task ? edit.task.status : ''} name="status">
                                <option value="to do">TO DO</option>
                                <option value="in progress">IN PROGRESS</option>
                                <option value="under review">UNDER REVIEW</option>
                                <option value="done">DONE</option>
                            </select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => { setAssignUser(false); setEdit({ proceed: false }); setValidation() }}>Close</Button>
                            <Button name="intent" value="update" type="submit">UPDATE</Button>
                        </Modal.Footer>
                    </RouterForm>
                </Modal>
                <Modal show={member}>
                    <section className="members">
                        <Card>
                            <Card.Header>
                                <Card.Title>Members</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                {project?.members.map(m => (
                                    <Card.Text key={m._id}>{m.name}</Card.Text>
                                ))}
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-flex align-items-center">
                                    <Form.Control
                                        size="sm"
                                        className="me-2 w-auto"
                                        placeholder="invite member"
                                    />
                                    <Button size="sm" className="text-nowrap">
                                        Add member
                                    </Button>
                                    <Button size="sm" className="ms-1" variant="secondary" onClick={() => setMember(false)}>Close</Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </section>
                </Modal>
            </Container >
        </div>
    )
}