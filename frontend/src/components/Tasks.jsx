import { useSelector } from "react-redux"
import { useActionData, useLocation, useNavigate } from "react-router-dom"
import { Form as RouterForm, redirect, useParams } from "react-router-dom"
import { addTaskAPI, deleteTaskAPI, updateTaskAPI } from "../services/taskService"
import { useDispatch } from "react-redux"
import { addTask, deleteTask, updateTask } from "../slice/TaskSlice"
import { store } from '../store/store'
import { useEffect, useState } from "react"
import { Badge, Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap"
import { getProjectAPI } from "../services/projectService"

export default function Tasks() {

    const tasks = useSelector(state => state.tasks)
    console.log(tasks.length)
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

    useEffect(() => {
        if (actionData?.success) {
            setAdd(false)
            setEdit({ proceed: false, task: null })
        }
    }, [actionData])

    const update = (d) => {
        setEdit({ proceed: !edit.proceed, task: d })
    }

    const loadMembers = async () => {
        const current = await getProjectAPI(params.id)
        setProject(current.data.project)
        console.log(project)
        setMember(true)
    }

    return (
        <div >
            <h1 className="text-center bg-primary py-4 fw-bold mb-4 text-white">TASKS</h1>
            <Container >
                <div className="d-flex justify-content-between mb-3">
                    <Button className="border-2 rounded-5 me-auto" style={{ width: "40px", height: "40px" }} onClick={() => navigate(-1)}>&larr;</Button>
                    <Button className="ms-auto" onClick={() => setAdd(true)}>+</Button>
                    <Button className="ms-2" onClick={() => loadMembers()}>members</Button>
                </div>
                <Row xs={2} md={3} lg={4} className="g-4 mt-5">
                    {tasks.map((d, i) => {
                        return (<Col key={i}>
                            <Card>
                                <Card.Header className="d-flex justify-content-between align-items-center w-100 pb-1 bg-primary">
                                    <Card.Title className="text-white">{d.title}</Card.Title>
                                    <Button variant="link text-black" style={{ cursor: 'pointer' }} className="" onClick={() => update(d)}>&#9998;</Button>
                                </Card.Header>
                                <Card.Body className="m-0">
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

                                    {d.user && (
                                        <div className="border-top pt-2 mt-2 d-flex align-items-center justify-content-between small text-muted">
                                            <span className="fw-semibold">Assigned To:</span>
                                            <span className="text-dark fw-medium">{d.user}</span>
                                        </div>
                                    )}
                                </Card.Body>
                                <Card.Footer className="border-top-0 bg-transparent text-end">
                                    <Button variant="outline-danger" onClick={() => {
                                        deleteTaskAPI(d.project_id, d._id)
                                        dispatch(deleteTask(d._id))
                                    }}>&times;</Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                        )
                    })}
                </Row>
                <Modal show={add}>
                    <RouterForm method="post">
                        <Modal.Header>
                            <Modal.Title className="text-primary">NEW TASK</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Title: </Form.Label>
                                <Form.Control name="title" type="text" placeholder="enter title" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Description:
                                </Form.Label>
                                <Form.Control name="description" type="text" placeholder="enter description" />
                            </Form.Group>
                            <fieldset className="mb-3">
                                <legend className="m-0">Priority</legend>
                                <label htmlFor="low">Low<input defaultChecked value="low" id="low" name="priority" type="radio" /></label>
                                <label htmlFor="medium">Medium<input value="medium" id="medium" name="priority" type="radio" /></label>
                                <label htmlFor="high">High<input value="high" id="high" name="priority" type="radio" /></label>
                            </fieldset>
                            <select name="status">
                                <option value="to do">TO DO</option>
                                <option value="in progress">IN PROGRESS</option>
                                <option value="under review">UNDER REVIEW</option>
                                <option value="done">DONE</option>
                            </select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setAdd(false)}>Close</Button>
                            <Button name="intent" value="create" type="submit">ADD</Button>
                        </Modal.Footer>
                    </RouterForm>
                </Modal>
                <Modal show={edit.proceed}>
                    <RouterForm method="post" key={edit.task ? edit.task._id : ''}>
                        <input type="hidden" name="taskId" value={edit.task ? edit.task._id : ''} />
                        <Modal.Header>
                            <Modal.Title className="text-primary">EDIT TASK</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label><h5>Title</h5></Form.Label>
                                <Form.Control defaultValue={edit.task ? edit.task.title : ''} name="title" type="text" placeholder="enter title" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><h5>Description</h5></Form.Label>
                                <Form.Control defaultValue={edit.task ? edit.task.description : ''} name="description" type="text" placeholder="enter description" />
                            </Form.Group>
                            <fieldset className="mb-3">
                                <legend className="m-0">Priority</legend>
                                <label htmlFor="low">Low<input defaultChecked={edit.task ? edit.task.priority == 'low' : ''} value="low" id="low" name="priority" type="radio" /></label>
                                <label htmlFor="medium">Medium<input defaultChecked={edit.task ? edit.task.priority == 'medium' : ''} value="medium" id="medium" name="priority" type="radio" /></label>
                                <label htmlFor="high">High<input defaultChecked={edit.task ? edit.task.priority == 'high' : ''} value="high" id="high" name="priority" type="radio" /></label>
                            </fieldset>
                            <select defaultValue={edit.task ? edit.task.status : ''} name="status">
                                <option value="to do">TO DO</option>
                                <option value="in progress">IN PROGRESS</option>
                                <option value="under review">UNDER REVIEW</option>
                                <option value="done">DONE</option>
                            </select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setEdit({ proceed: false })}>Close</Button>
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

export const taskAction = async ({ request, params }) => {
    const { id } = params
    const formData = await request.formData()
    const intent = formData.get('intent')
    const cleanedData = Object.fromEntries(formData)
    try {
        if (intent === 'create') {
            const ret = await addTaskAPI(id, cleanedData)
            console.log("return", ret.data)
            console.log("test", ret.data.task)
            if (ret) store.dispatch(addTask(ret.data.task))
            return {
                success: true
            }
        }

        if (intent === 'update') {
            const taskId = formData.get("taskId");
            const ret = await updateTaskAPI(id, taskId, cleanedData);
            console.log("return", ret.data.data)
            if (ret) store.dispatch(updateTask(ret.data.data));
            return { success: true };
        }

        return { success: false, message: "Invalid action intent." };
    }
    catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}