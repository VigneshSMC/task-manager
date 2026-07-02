import { API } from '../api/api'
const BASE_URL = '/users'

const getAllUsers = async () => {
    try {
        return (await API.get(`${BASE_URL}`)).data
    }
    catch(error) {
        return {error: error.message}
    }
}

export { getAllUsers } ;