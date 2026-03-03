import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CreateComplaint from './pages/CreateComplaint'
import ComplaintList from './pages/ComplaintList'
import AdminAnalytics from './pages/AdminAnalytics'
import ManageComplaints from './pages/ManageComplaints'
import AssignedComplaints from './pages/AssignedComplaints'
import UserManagement from './pages/UserManagement'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'

const MainLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

const App = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl"></div>
                    <div className="text-sm font-black uppercase text-indigo-500 tracking-[0.3em] animate-pulse">Initializing Portal</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                    <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />

                            {/* User Routes */}
                            <Route path="/complaints" element={<ComplaintList />} />
                            <Route path="/complaints/new" element={
                                user?.role === 'user' ? <CreateComplaint /> : <Navigate to="/dashboard" />
                            } />

                            {/* Technician Routes */}
                            <Route path="/tech/assigned" element={
                                user?.role === 'technician' ? <AssignedComplaints /> : <Navigate to="/dashboard" />
                            } />

                            {/* Admin Routes */}
                            <Route path="/admin/analytics" element={
                                user?.role === 'admin' ? <AdminAnalytics /> : <Navigate to="/dashboard" />
                            } />
                            <Route path="/admin/manage" element={
                                user?.role === 'admin' ? <ManageComplaints /> : <Navigate to="/dashboard" />
                            } />
                            <Route path="/admin/users" element={
                                user?.role === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" />
                            } />

                            <Route path="/" element={<Navigate to="/dashboard" />} />
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AnimatePresence>
        </div>
    )
}

export default App
