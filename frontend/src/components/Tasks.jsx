import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { Form } from "react-router-dom"
import { addTaskAPI, deleteTaskAPI } from "../services/taskService"
import { useDispatch } from "react-redux"
import { deleteTask } from "../slice/TaskSlice"
import { store } from '../store/store'

export default function Tasks() {

    const tasks = useSelector(state => state.tasks)
    const dispatch = useDispatch()
    console.log(tasks)

    return (
        <>
        <h1>TASKS</h1>
        <section className="tasks">
            <ul>
                {tasks.map((d, i) => {
                    return (<li key={i}>
                        <div className="taskitem">
                            <h3>{d.title}</h3>
                            <p>{d.description}</p>
                        </div>
                        <h4 onClick={() => {
                            deleteTaskAPI(d.project_id, d._id)
                            dispatch(deleteTask(d._id))
                        }}>DEL</h4>
                    </li>
                    )
                })}
            </ul>
            <Form method="post">
                <input name="title" type="text" placeholder="title" />
                <input name="description" type="text" placeholder="description" />
                <button>ADD</button>
            </Form>
        </section>
        </>
    )
}

export const addTaskData = async ({ request, params }) => {

    const { id } = params
    const formData = await request.formData()
    const cleanedPost = Object.fromEntries(formData)
    const ret = await addTaskAPI(id, cleanedPost)
    if (ret) store.dispatch(addTask(ret))
}