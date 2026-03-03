import React, { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    PlusCircle,
    ClipboardList,
    ChevronLeft,
    ShieldCheck,
    Wrench,
    Activity,
    Users,
    Settings,
    HelpCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false)
    const { user } = useAuth()

    const navItems = useMemo(() => {
        const items = [
            { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        ]

        // Role specific items
        if (user?.role === 'admin') {
            items.push(
                { name: 'Global Analytics', icon: <Activity size={20} />, path: '/admin/analytics' },
                { name: 'Log Management', icon: <ClipboardList size={20} />, path: '/admin/manage' },
                { name: 'Team Hub', icon: <Users size={20} />, path: '/admin/users' }
            )
        } else if (user?.role === 'technician') {
            items.push(
                { name: 'Task Board', icon: <Wrench size={20} />, path: '/tech/assigned' },
                { name: 'Service Logs', icon: <ClipboardList size={20} />, path: '/complaints' }
            )
        } else {
            // Regular user
            items.push(
                { name: 'New Request', icon: <PlusCircle size={20} />, path: '/complaints/new' },
                { name: 'My Activity', icon: <ClipboardList size={20} />, path: '/complaints' }
            )
        }

        return items
    }, [user?.role])

    return (
        <motion.div
            animate={{ width: collapsed ? 100 : 300 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="glass-sidebar h-screen overflow-hidden flex flex-col relative z-20 group border-r border-slate-200/40 dark:border-slate-800/40 shadow-xl"
        >
            <div className="h-20 flex items-center px-8 transition-all gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/40 border-2 border-white/20">
                    <ShieldCheck className="text-white" size={28} />
                </div>
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex-1 min-w-0"
                        >
                            <div className="font-extrabold text-lg text-slate-800 dark:text-slate-100 truncate italic tracking-tighter">
                                SCMP Portal
                            </div>
                            <div className="text-[10px] uppercase font-black text-indigo-500 tracking-widest mt-0.5">Enterprise v2.0</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <nav className="flex-1 px-5 py-10 space-y-3 mt-4 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `nav-link group/link border-2 border-transparent transition-all duration-300 transform-gpu ${isActive ? 'nav-link-active !border-indigo-100 dark:!border-indigo-800/40' : 'hover:scale-[1.02] hover:translate-x-1'}`}
                    >
                        <span className={`shrink-0 transition-transform duration-300 group-hover/link:scale-110`}>{item.icon}</span>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="whitespace-nowrap font-bold text-sm"
                            >
                                {item.name}
                            </motion.span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 mt-auto space-y-6">
                <div className="space-y-2">
                    {!collapsed && <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Preference</div>}
                    <div className="flex flex-col gap-2">
                        <button className={`flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 font-bold text-sm ${collapsed ? 'justify-center' : ''}`}>
                            <Settings size={20} />
                            {!collapsed && <span>Settings</span>}
                        </button>
                        <button className={`flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 font-bold text-sm ${collapsed ? 'justify-center' : ''}`}>
                            <HelpCircle size={20} />
                            {!collapsed && <span>Support</span>}
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full h-12 flex items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all shadow-md group border border-indigo-100 dark:border-indigo-800/40"
                >
                    <ChevronLeft className={`transition-transform duration-500 ${collapsed ? 'rotate-180' : ''}`} size={24} />
                </button>

                {!collapsed && (
                    <div className="px-5 pt-4 text-center">
                        <div className="text-[11px] font-black text-slate-600 dark:text-slate-400 capitalize bg-white/50 dark:bg-slate-800/50 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm shadow-sm italic">
                            {user?.role} Restricted View
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default Sidebar
