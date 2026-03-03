import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, User, Mail, Lock, Briefcase } from 'lucide-react'
import axios from 'axios'

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            await axios.post('http://127.0.0.1:8000/auth/signup', formData)
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg glass-card p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30 text-white">
                        <UserPlus size={28} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-slate-500 dark:text-slate-400">Join the smart maintenance network</p>
                </div>

                {error && (
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm rounded-xl border border-rose-100 dark:border-rose-800/50 text-center font-medium">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Username</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                required
                                className="input-field pl-12"
                                placeholder="Unique ID"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Role</label>
                        <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <select
                                className="input-field pl-12 appearance-none cursor-pointer"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="user">User</option>
                                <option value="technician">Technician</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                className="input-field pl-12"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                className="input-field pl-12"
                                placeholder="Safety first"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-2">
                        <button type="submit" disabled={isLoading} className="btn-primary flex items-center justify-center gap-2">
                            {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Already have an account? </span>
                    <Link to="/login" className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline underline-offset-4">Log in</Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Signup
