import React, { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const decoded = jwtDecode(token)
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout()
                } else {
                    setUser({
                        username: decoded.sub,
                        role: decoded.role
                    })
                }
            } catch (error) {
                localStorage.removeItem('token')
            }
        }
        setLoading(false)
    }, [])

    const login = async (username, password) => {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)

        const response = await axios.post('http://127.0.0.1:8000/auth/login', formData)
        const { access_token } = response.data
        localStorage.setItem('token', access_token)

        const decoded = jwtDecode(access_token)
        setUser({
            username: decoded.sub,
            role: decoded.role
        })
        return decoded
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
