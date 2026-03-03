import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Wrench,
    Clock,
    CheckCircle2,
    User as UserIcon,
    AlertCircle,
    Calendar,
    ChevronRight,
    MessageSquare
} from 'lucide-react'
import { complaintService } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'

const AssignedComplaints = () => {
    const [complaints, setComplaints] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuth()

    const fetchComplaints = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await complaintService.getAll()
            // Technician's GET /complaints/ is filtered by backend already
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

    const handleUpdateStatus = async (id, currentStatus) => {
        let nextStatus = ''
        if (currentStatus === 'assigned' || currentStatus === 'pending') nextStatus = 'in_progress'
        else if (currentStatus === 'in_progress') nextStatus = 'resolved'
        else {
            alert("No further updates possible.")
            return
        }

        const notes = prompt(`Complete task? (Add resolution notes if any):`)
        if (window.confirm(`Move status to ${nextStatus.replace('_', ' ')}?`)) {
            try {
                await complaintService.updateStatus(id, nextStatus)
                fetchComplaints()
            } catch (err) {
                alert("Status update failed.")
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 italic">
                        <Wrench className="text-indigo-600" />
                        Technician Board
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage tasks assigned to your queue</p>
                </div>

                <div className="p-4 bg-white/70 dark:bg-slate-800/70 glass-card rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-black">
                        {complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length}
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Tasks</div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">On your board</div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-40 glass-card rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : complaints.length === 0 ? (
                <div className="p-20 glass-card rounded-[3rem] text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300 border-2 border-dashed border-slate-200">
                        <CheckCircle2 size={40} />
                    </div>
                    <div className="text-xl font-bold text-slate-600 dark:text-slate-300">All sets complete!</div>
                    <p className="text-slate-400 max-w-sm mx-auto">No pending tasks assigned to you at the moment. Enjoy the break!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence>
                        {complaints.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-0 rounded-[2rem] overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
                            >
                                <div className={`w-2 md:w-3 shrink-0 ${item.status === 'in_progress' ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'
                                    }`} />

                                <div className="p-8 flex-1">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <StatusBadge status={item.status} />
                                                <div className="text-xs font-bold text-slate-400">#LOG-{item.id}</div>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 italic">{item.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="shrink-0 flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Created</div>
                                                <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{new Date(item.created_at).toLocaleDateString()}</div>
                                            </div>
                                            <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800 hidden sm:block mx-2"></div>
                                            <button
                                                onClick={() => handleUpdateStatus(item.id, item.status)}
                                                disabled={item.status === 'resolved' || item.status === 'closed'}
                                                className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold rounded-2xl transition-all flex items-center gap-3 shadow-lg shadow-indigo-500/20 active:scale-95"
                                            >
                                                {item.status === 'in_progress' ? 'Mark Resolved' : 'Take Action'}
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center gap-6 text-xs font-bold text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <UserIcon size={14} /> Reported by ID: {item.owner_id}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MessageSquare size={14} /> 0 Responses
                                        </div>
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

export default AssignedComplaints
