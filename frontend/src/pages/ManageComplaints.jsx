import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ClipboardList,
    Search,
    User as UserIcon,
    ShieldCheck,
    Edit2,
    MoreVertical,
    Calendar,
    Filter,
    ArrowRight
} from 'lucide-react'
import { complaintService } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'

const ManageComplaints = () => {
    const [complaints, setComplaints] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const { user } = useAuth()

    const fetchComplaints = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await complaintService.getAll()
            setComplaints(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchComplaints()
    }, [fetchComplaints])

    const filtered = useMemo(() => {
        return complaints.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.description.toLowerCase().includes(search.toLowerCase())
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [complaints, search, statusFilter])

    const handleAssign = async (id, currentTech) => {
        const technician = prompt("Enter technician username to assign/reassign:", currentTech || "")
        if (technician) {
            try {
                await complaintService.assign(id, technician)
                fetchComplaints()
            } catch (err) {
                alert("Failed to assign. Ensure user is a technician.")
            }
        }
    }

    const handleForceClose = async (id) => {
        if (window.confirm("Are you sure you want to force close this complaint?")) {
            try {
                // Using updateStatus since role is admin
                await complaintService.updateStatus(id, 'closed')
                fetchComplaints()
            } catch (err) {
                alert("Action failed.")
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 italic">
                        <ShieldCheck className="text-indigo-600" />
                        Operation Command
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Full control over all platform logs</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find logs..."
                            className="input-field pl-12 min-w-[250px] shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field w-auto min-w-[140px] appearance-none cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">Active</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-72 glass-card rounded-[2.5rem] animate-pulse"></div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="p-20 glass-card rounded-[3rem] text-center text-slate-400 flex flex-col items-center gap-4">
                    <Search size={40} className="text-slate-200" />
                    No logs match your filter criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filtered.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-between group border-slate-200/50 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <StatusBadge status={item.status} />
                                        <button className="p-2 -mr-2 text-slate-400 hover:text-indigo-600">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{item.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center gap-3 py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                                            {item.assigned_to?.[0] || '?'}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Technician</div>
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                                                {item.assigned_to || 'Not Assigned'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <div className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}</div>
                                        <div>LOG #{item.id}</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAssign(item.id, item.assigned_to)}
                                            className="flex-1 h-11 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            Assign <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => handleForceClose(item.id)}
                                            className="h-11 px-4 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 font-bold rounded-2xl transition-all"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    )
}

export default ManageComplaints
