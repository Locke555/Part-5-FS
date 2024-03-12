import axios from 'axios'
const baseUrl = '/api/login'

const login = async (user) => {
    const request = await axios.post(baseUrl, user)
    return request.data
}

export default { login }