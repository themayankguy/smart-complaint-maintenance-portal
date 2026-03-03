import React from 'react'
import { LogOut, User, Bell, Search, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
    const { user, logout } = useAuth()

    return (
        <header className="h-20 flex items-center justify-between px-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/40 dark:border-slate-800/40 z-10 sticky top-0 shadow-sm">
            <div className="flex items-center gap-8 flex-1">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden lg:flex items-center gap-3 drop-shadow-sm italic">
                    <ShieldCheck className="text-indigo-600" />
                    Smart Complaint & Maintenance Portal
                </h2>

                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Global search..."
                        className="w-full bg-slate-100 dark:bg-slate-800/50 h-11 pl-12 pr-4 rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 group hover:border-indigo-500 transition-all">
                        <Bell size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block overflow-hidden">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{user?.username}</div>
                        <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{user?.role}</div>
                    </div>

                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-500/20 border-2 border-white/20">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>

                    <button
                        onClick={logout}
                        className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-900/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100 dark:border-rose-900/20 active:scale-95"
                        title="Secure Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar
