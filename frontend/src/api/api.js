import axios from 'axios'

const URL = import.meta.env.VITE_API_URL

const API = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

API.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

export { API }