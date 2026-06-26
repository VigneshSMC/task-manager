import { API } from '../api/api'

const BASE_URL = "/auth"

const userlogin = async (data) => {
    try {
        const response = await API.post(`${BASE_URL}/login`, data)
        if (response.data?.user?.token) localStorage.setItem('token', response.data.user.token)
        return response
    }
    catch (error) {
        throw error
    }
}

const registerUser = async (data) => {
    try {
        const response = await API.post(`${BASE_URL}/register`, data)
        if (response.data?.user?.token) localStorage.setItem('token', response.data.user.token)
        return response
    }
    catch(error) {
        throw error
    }
}

export { userlogin, registerUser }