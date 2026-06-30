import { API } from '../api/api'

const BASE_URL = "/projects"

const getProjectsAPI = async () => {
    try {
        const out =  (await API.get(BASE_URL)).data
        console.log(out)
        return out
    }
    catch (error) {
        console.log({ error: error.message })
    }
}

const deleteProjectAPI = async (id) => {
    try {
        await API.delete(`${BASE_URL}/${id}`)
    }
    catch (error) {
        console.log({ error: error.message })
    }
}

const addProjectAPI = async (data) => {
    try {
        return await API.post(BASE_URL, data)
    }
    catch (error) {
        console.log({ error: error.message })
    }
}

const updateProjectAPI = async (id, data) => {
    try {
        await API.put(`${BASE_URL}/${id}`, data)
    }
    catch (error) {
        console.log({ error: error.message })
    }
}

const getProjectAPI = async (id) => {
    try {
        await API.get(`BASE_URL/${id}`, data)
    }
    catch (error) {
        console.log({ error: error.message })
    }
}

export { getProjectsAPI, deleteProjectAPI, addProjectAPI }