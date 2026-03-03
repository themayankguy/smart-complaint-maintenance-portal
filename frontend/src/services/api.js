import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const authService = {
    signup: (userData) => api.post('/auth/signup', userData),
    login: (credentials) => {
        const formData = new FormData()
        formData.append('username', credentials.username)
        formData.append('password', credentials.password)
        return api.post('/auth/login', formData)
    }
}

export const complaintService = {
    getAll: () => api.get('/complaints/'),
    getById: (id) => api.get(`/complaints/${id}`),
    create: (data) => api.post('/complaints/', data),
    updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
    assign: (id, technician) => api.put(`/complaints/${id}/assign`, { assigned_to: technician }),
    analytics: () => api.get('/complaints/analytics')
}

export default api
