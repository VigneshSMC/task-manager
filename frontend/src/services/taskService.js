import { API } from '../api/api'

const BASE_URL = "/tasks"

const getTasksAPI = async (id) => {
    try {
        console.log(id)
        return (await API.get(`/projects/${id}${BASE_URL}`)).data
    }
    catch (error) {
        console.log({ error: error.message })
    }
}

const deleteTaskAPI = async (id, taskId) => {
    try {
        await API.delete(`/projects/${id}${BASE_URL}/${taskId}`)
    }
    catch (error) {
        console.log({ error: error.message })
    }
}

const addTaskAPI = async (id, data) => {
    try {
        console.log(data)
        await API.post(`/projects/${id}${BASE_URL}`, data)
    }
    catch (error) {
        console.log({ error: error.message })
    }
}

const updateTaskAPI = async (id, data) => {
    try {
        await API.put(`${BASE_URL}/${id}`, data)
    }
    catch (error) {
        console.log({ error: error.message })
    }
}

const getTaskAPI = async (id) => {
    try {
        await API.get(`BASE_URL/${id}`, data)
    }
    catch (error) {
        console.log({ error: error.message })
    }
}

export { getTasksAPI, deleteTaskAPI, addTaskAPI }