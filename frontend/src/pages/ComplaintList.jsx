import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ClipboardList,
    Search,
    Trash2,
    Edit2,
    MoreHorizontal,
    Calendar,
    User as UserIcon,
    ShieldAlert,
    PlusCircle,
    XCircle
} from 'lucide-react'
import { complaintService } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
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
        return complaints.filter(c =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase())
        )
    }, [complaints, search])

    const handleCancel = async (id, status) => {
        if (status !== 'pending') {
            alert("Only pending requests can be cancelled.")
            return
        }
        if (window.confirm("Are you sure you want to cancel this request?")) {
            try {
                // Actually in user context, we don't have a specific cancel endpoint 
                // We'll update status to 'closed' which is typically a terminal state
                await complaintService.updateStatus(id, 'closed')
                fetchComplaints()
            } catch (err) {
                alert("Failed to cancel.")
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto space-y-10"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-4 italic tracking-tighter">
                        <ClipboardList className="text-indigo-600" size={36} />
                        My Activity Log
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                        Manage and track your portal submissions
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Find logs..."
                            className="input-field pl-12 min-w-[300px] h-14 shadow-lg shadow-slate-200/30 dark:shadow-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {user.role === 'user' && (
                        <Link to="/complaints/new" className="h-14 px-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl shadow-indigo-500/30">
                            <PlusCircle size={20} />
                            <span className="hidden sm:inline">New Request</span>
                        </Link>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 glass-card rounded-[3rem] animate-pulse"></div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-24 glass-card rounded-[3.5rem] text-center space-y-6 border-slate-200/50">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700 shadow-inner">
                        <ShieldAlert size={50} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Clean Slate</h3>
                        <p className="text-slate-400 dark:text-slate-500 max-w-sm mx-auto">You haven't filed any complaints yet or no matches were found.</p>
                    </div>
                    <Link to="/complaints/new" className="px-8 py-3 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-800/50">
                        Create first request
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filtered.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.05, ease: 'backOut' }}
                                className="glass-card p-10 rounded-[3rem] flex flex-col justify-between group hover:border-indigo-500 transition-all duration-500 shadow-xl shadow-slate-200/30 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform group-hover:scale-110 duration-700">
                                    <ClipboardList size={200} />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <StatusBadge status={item.status} />
                                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/50 text-[10px] font-black uppercase text-slate-400">
                                            Log #{item.id}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors italic tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase">
                                            <Calendar size={14} className="text-indigo-500" />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>

                                    {user.role === 'user' && item.status === 'pending' && (
                                        <div className="pt-2 flex gap-3">
                                            <button
                                                onClick={() => handleCancel(item.id, item.status)}
                                                className="flex-1 h-12 flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 dark:border-rose-900/30"
                                            >
                                                <XCircle size={18} />
                                                Cancel
                                            </button>
                                            <Link
                                                to={`/complaints/edit/${item.id}`} // Assuming edit route exists or will be simple
                                                className="flex-1 h-12 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                            >
                                                <Edit2 size={16} />
                                                Edit
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    )
}

export default ComplaintList
