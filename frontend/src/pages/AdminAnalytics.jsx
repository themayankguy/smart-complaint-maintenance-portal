import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart3,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    Users,
    Calendar,
    ChevronRight
} from 'lucide-react'
import { complaintService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const AdminAnalytics = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchStats = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await complaintService.analytics()
            setStats(res.data)
        } catch (err) {
            setError('Failed to fetch analytics data.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    const statCards = useMemo(() => {
        if (!stats) return []
        return [
            { label: 'Total Logs', value: stats.total, color: 'indigo', icon: <BarChart3 /> },
            { label: 'Unassigned', value: stats.pending, color: 'rose', icon: <AlertCircle /> },
            { label: 'In Progress', value: stats.in_progress, color: 'amber', icon: <Clock /> },
            { label: 'Completed', value: stats.resolved + stats.closed, color: 'emerald', icon: <CheckCircle /> },
        ]
    }, [stats])

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )

    if (error) return (
        <div className="glass-card p-8 rounded-3xl text-center text-rose-500 font-medium">
            {error}
            <button onClick={fetchStats} className="ml-4 text-indigo-600 underline">Retry</button>
        </div>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 italic">Global Insights</h1>
                    <p className="text-slate-500 dark:text-slate-400">Enterprise distribution and performance metrics</p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2">
                    <TrendingUp size={18} />
                    Live Monitor
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 rounded-[2rem] shadow-sm group hover:scale-[1.02] transition-transform duration-300"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${card.color}-100 dark:bg-${card.color}-950/30 text-${card.color}-600 dark:text-${card.color}-400 mb-4`}>
                            {card.icon}
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{card.value}</div>
                        <div className="text-sm font-semibold text-slate-500 dark:text-slate-500 mt-1 uppercase tracking-wider">{card.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Status Distribution</h3>
                        <button className="text-indigo-600 font-bold text-sm flex items-center gap-1">View Full Report <ChevronRight size={16} /></button>
                    </div>

                    <div className="space-y-6">
                        {['pending', 'assigned', 'in_progress', 'resolved', 'closed'].map((status) => {
                            const val = stats[status] || 0
                            const perc = stats.total > 0 ? (val / stats.total) * 100 : 0
                            return (
                                <div key={status} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold capitalize">
                                        <span className="text-slate-600 dark:text-slate-400">{status.replace('_', ' ')}</span>
                                        <span className="text-slate-800 dark:text-slate-200">{val} ({perc.toFixed(0)}%)</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${perc}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className="h-full bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white relative flex flex-col justify-between shadow-2xl shadow-indigo-500/30 border-none">
                    <div>
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                            <Users size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Enterprise Access</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                            Manage your service workforce and monitoring team from one centralized command center.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                            <Calendar size={18} className="text-indigo-200" />
                            <div className="text-xs">
                                <div className="font-bold text-indigo-50">Last Backup</div>
                                <div className="text-indigo-200">Today at 12:45 PM</div>
                            </div>
                        </div>
                        <button className="w-full py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors shadow-lg">
                            User Management
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default AdminAnalytics
