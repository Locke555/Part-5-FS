import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: {
      Authorization: token
    },
  }
  try {
    const request = await axios.get(baseUrl, config)
    return request.data

  } catch (e) {
    throw e
  }
}

const create = async (newObject) => {
  const config = {
    headers: {
      Authorization: token
    },
  }
  try {
    const request = await axios.post(baseUrl, newObject, config)
    return request.data
  } catch (e) {
    throw e
  }
}

const edit = async (newObject, id) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  try {
    const request = await axios.put(`${baseUrl}/${id}`, newObject, config)
    return request.data
  } catch (e) {
    throw e
  }
}

const remove = async (id) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  try {
    const request = await axios.delete(`${baseUrl}/${id}`, config)
  } catch (e) {
    throw e
  }
}

export default { getAll, setToken, create, edit, remove }