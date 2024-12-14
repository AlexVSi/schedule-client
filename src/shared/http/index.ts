import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL
const AUTH_URL = import.meta.env.VITE_AUTH_URL

export const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

export const $apiAuth = axios.create({
    withCredentials: true,
    baseURL: AUTH_URL,
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `${localStorage.getItem('token')}`
    return config
})

$api.interceptors.response.use((config) => {
    return config
}, (async (error) => {
    const originalReq = error.config
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalReq._isRetry = true
        try {
            const response = await axios.get(`${AUTH_URL}refresh`, { withCredentials: true })
            localStorage.setItem('token', response.data.tokens.accessToken)
            return $api.request(originalReq)
        } catch (e) {
            console.log(e);
        }
    }
}))
