import { httpService } from './http.service'
import { utilService } from './util.service'

const BASE_URL = 'user/'
const AUTH_URL = 'auth/'
const STORAGE_KEY = 'userDB'

export const userService = {
    query,
    getById,
    save,
    remove,
    getEmptyUser,
    getDefaultFilter,
    getDefaultSort,
    login,
    signup,
    logout,
    getLoggedInUser,
    getEmptyCredentials,
}

function query(filterBy = {}, sortBy, pageIdx) {
    return httpService.get(BASE_URL, { filterBy, sortBy, pageIdx })
}

function getById(userId) {
    return httpService.get(BASE_URL + userId)
}

function remove(userId) {
    return httpService.delete(BASE_URL + userId)
}

function save(user) {
    const method = user._id ? 'put' : 'post'
    return httpService[method](BASE_URL, user)
}

function getDefaultFilter() {
    return {
        username: '',
        fullname: '',
        isAdmin: null,
        pageIdx: 0,
    }
}

function getDefaultSort() {
    return { type: '', desc: 1 }
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        isAdmin: false,
    }
}

// Authentication methods
function login(credentials) {
    return httpService.post(AUTH_URL + 'login', credentials)
}

function signup(user) {
    return httpService.post(AUTH_URL + 'signup', user)
}

function logout() {
    return httpService.post(AUTH_URL + 'logout')
}

function getLoggedInUser() {
    return httpService.get(AUTH_URL + 'me')
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
    }
}
