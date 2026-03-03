import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
