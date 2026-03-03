import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShieldCheck,
    Search,
    UserPlus,
    Trash2,
    MoreVertical,
    Briefcase,
    Mail,
    User as UserIcon
} from 'lucide-react'

// Placeholder for User Management since backend lacks specific endpoints
const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Mock users since there is no GET /users in the backend current spec
    const users = [
        { id: 1, username: 'admin_mayank', email: 'admin@scmp.com', role: 'admin' },
        { id: 2, username: 'tech_expert', email: 'john@maintenance.com', role: 'technician' },
        { id: 3, username: 'user_regular', email: 'user1@example.com', role: 'user' },
    ]

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <ShieldCheck className="text-indigo-600" />
                        Team Command
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage platform access and workforce roles</p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                    <UserPlus size={18} />
                    Onboard User
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, role or email..."
                    className="input-field pl-12 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                                <th className="px-8 py-5 font-bold">Identity</th>
                                <th className="px-8 py-5 font-bold">Contact</th>
                                <th className="px-8 py-5 font-bold">Access Level</th>
                                <th className="px-8 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-slate-200 dark:border-slate-600">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-slate-100">{user.username}</div>
                                                <div className="text-xs text-slate-400">ID: #{user.id.toString().padStart(4, '0')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
                                            <Mail size={14} className="text-slate-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${user.role === 'admin'
                                                ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/30'
                                                : user.role === 'technician'
                                                    ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/30'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                            <button className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="py-20 text-center text-slate-500">
                        No team members found.
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default UserManagement
