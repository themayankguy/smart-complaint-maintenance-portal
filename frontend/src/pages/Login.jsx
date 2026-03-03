import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, ShieldCheck, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            await login(credentials.username, credentials.password)
            navigate('/dashboard')
        } catch (err) {
            setError('Invalid username or password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-card p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <ShieldCheck size={120} className="text-indigo-600" />
                </div>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
                        <LogIn className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Login</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back to the portal</p>
                </div>

                {error && (
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm rounded-xl border border-rose-100 dark:border-rose-800/50 text-center font-medium">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Username</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                required
                                className="input-field pl-12"
                                placeholder="Enter your username"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                className="input-field pl-12"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="btn-primary mt-4 flex items-center justify-center gap-2">
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Don't have an account? </span>
                    <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline underline-offset-4">Create Account</Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
