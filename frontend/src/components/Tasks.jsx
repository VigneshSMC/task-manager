import { useSelector } from "react-redux"
import { useActionData, useLocation, useNavigate } from "react-router-dom"
import { Form, redirect, useParams } from "react-router-dom"
import { addTaskAPI, deleteTaskAPI, updateTaskAPI } from "../services/taskService"
import { useDispatch } from "react-redux"
import { addTask, deleteTask, updateTask } from "../slice/TaskSlice"
import { store } from '../store/store'
import Members from "./Members"
import { useEffect, useState } from "react"

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
    const actionData = useActionData()

    useEffect(() => {
        if (actionData?.success) {
            setAdd(false)
            setEdit({ proceed: false, task: null })
        }
    }, [actionData])

    const update = (d) => {
        setEdit({ proceed: !edit.proceed, task: d })
    }

    return (
        <main className="spec">
            <div className="top">
                <button className="goback" onClick={() => navigate(-1)}>&larr;</button>
                <h1>TASKS</h1>
                <button className="addtask" onClick={() => setAdd(true)}>+</button>
            </div>
            <section className="tasks">
                <ul>
                    {tasks.map((d, i) => {
                        return (<li key={i}>
                            <div className="taskitem">
                                <div className="title"><h3>{d.title}</h3><span className="edit" onClick={() => update(d)}>&#9998;</span></div>
                                <p>Descripton: {d.description}</p>
                                <p>Priority: {d.priority}</p>
                                <p>Status: {d.status}</p>
                            </div>
                            <h4 onClick={() => {
                                deleteTaskAPI(d.project_id, d._id)
                                dispatch(deleteTask(d._id))
                            }}>&times;</h4>
                        </li>
                        )
                    })}
                </ul>
            </section>
            {add &&
                <Form method="post">
                    <div className="title"><h2>NEW TASK</h2><h1 onClick={() => setAdd(false)}>&times;</h1></div>
                    <input name="title" type="text" placeholder="title" />
                    <input name="description" type="text" placeholder="description" />
                    <fieldset>
                        <legend>Priority</legend>
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
                    <button name="intent" value="create">ADD</button>
                </Form>
            }
            {edit.proceed &&
                <Form method="post" key={edit.task._id}>
                    <input type="hidden" name="taskId" value={edit.task._id} />
                    <div className="title"><h2>EDIT TASK</h2><h1 onClick={() => update()}>&times;</h1></div>
                    <input defaultValue={edit.task.title} name="title" type="text" placeholder="title" />
                    <input defaultValue={edit.task.description} name="description" type="text" placeholder="description" />
                    <fieldset>
                        <legend>Priority</legend>
                        <label htmlFor="low">Low<input defaultChecked={edit.task.priority == 'low'} value="low" id="low" name="priority" type="radio" /></label>
                        <label htmlFor="medium">Medium<input defaultChecked={edit.task.priority == 'medium'} value="medium" id="medium" name="priority" type="radio" /></label>
                        <label htmlFor="high">High<input defaultChecked={edit.task.priority == 'high'} value="high" id="high" name="priority" type="radio" /></label>
                    </fieldset>
                    <select defaultValue={edit.task.status} name="status">
                        <option value="to do">TO DO</option>
                        <option value="in progress">IN PROGRESS</option>
                        <option value="under review">UNDER REVIEW</option>
                        <option value="done">DONE</option>
                    </select>
                    <button name="intent" value="update">UPDATE</button>
                </Form>
            }
            {/* <Members /> */}
        </main>
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