import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    ClipboardList,
    Hourglass,
    Clock,
    CheckCircle,
    BarChart3,
    TrendingUp,
    UserCheck,
    Zap,
    Layout,
    PlusCircle
} from 'lucide-react'
import { complaintService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        assigned: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0
    })
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    const fetchStats = useCallback(async () => {
        setIsLoading(true)
        try {
            if (user.role === 'admin') {
                const res = await complaintService.analytics()
                setStats(res.data)
            } else {
                const res = await complaintService.getAll()
                const data = res.data
                const counts = {
                    total: data.length,
                    pending: data.filter(c => c.status === 'pending').length,
                    assigned: data.filter(c => c.status === 'assigned').length,
                    in_progress: data.filter(c => c.status === 'in_progress').length,
                    resolved: data.filter(c => c.status === 'resolved').length,
                    closed: data.filter(c => c.status === 'closed').length
                }
                setStats(counts)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [user.role])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    const statCards = useMemo(() => [
        { label: 'Total Logs', value: stats.total, color: 'indigo', icon: <ClipboardList /> },
        { label: 'Pending', value: stats.pending, color: 'amber', icon: <Hourglass /> },
        { label: 'In Progress', value: stats.in_progress, color: 'indigo', icon: <Clock /> },
        { label: 'Resolved', value: stats.resolved, color: 'emerald', icon: <CheckCircle /> },
    ], [stats])

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-12"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-4 italic tracking-tighter">
                        <Layout className="text-indigo-600" size={32} />
                        Command Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                        {user.role === 'admin' ? 'Monitoring global system health and lifecycle' : `Tracking your active maintenance pipeline`}
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                    <div className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                        {user.role} mode
                    </div>
                    <div className="pr-4 text-xs font-bold text-slate-500">
                        System Online
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((card, idx) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                        className="glass-card p-8 rounded-[2.5rem] group hover:border-indigo-500 transition-all duration-500 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none"
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${card.color}-100 dark:bg-${card.color}-950/30 text-${card.color}-600 dark:text-${card.color}-400 mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-sm border border-${card.color}-200/50 dark:border-${card.color}-800/30`}>
                            {card.icon}
                        </div>
                        <div className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{card.value}</div>
                        <div className="text-xs font-black text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest">{card.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] space-y-8 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3 italic">
                            <Zap size={24} className="text-amber-500" />
                            Priority Actions
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {user.role === 'user' && (
                            <Link to="/complaints/new" className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 hover:bg-indigo-600 hover:text-white transition-all group shadow-sm">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                                    <PlusCircle size={20} className="text-indigo-600 group-hover:text-white" />
                                </div>
                                <div className="text-lg font-bold mb-1 italic">Submit Job</div>
                                <div className="text-xs text-slate-500 group-hover:text-indigo-100">File a new maintenance request</div>
                            </Link>
                        )}

                        {user.role === 'admin' && (
                            <Link to="/admin/manage" className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 hover:bg-indigo-600 hover:text-white transition-all group shadow-sm">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                                    <BarChart3 size={20} className="text-indigo-600 group-hover:text-white" />
                                </div>
                                <div className="text-lg font-bold mb-1 italic">Dispatch Center</div>
                                <div className="text-xs text-slate-500 group-hover:text-indigo-100">Assign technicians to pending logs</div>
                            </Link>
                        )}

                        <button className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 hover:bg-emerald-600 hover:text-white transition-all group shadow-sm text-left">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                                <TrendingUp size={20} className="text-emerald-600 group-hover:text-white" />
                            </div>
                            <div className="text-lg font-bold mb-1 italic">System Audit</div>
                            <div className="text-xs text-slate-500 group-hover:text-emerald-100">Generate compliance report</div>
                        </button>
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-500 text-white border-none shadow-2xl shadow-indigo-500/30 flex flex-col justify-between">
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/20">
                            <UserCheck size={28} />
                        </div>
                        <h3 className="text-3xl font-black mb-4 italic tracking-tighter">Premium Support</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed max-w-[220px]">
                            Access priority assistance from our elite technical management team anytime.
                        </p>
                    </div>
                    <button className="relative z-10 w-full py-4 bg-white text-indigo-700 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs">
                        Connect Now
                    </button>

                    <div className="absolute -bottom-10 -right-10 opacity-10 blur-sm pointer-events-none transform rotate-12 scale-150">
                        <Zap size={240} />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default Dashboard
