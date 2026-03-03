import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95 overflow-hidden"
        >
            <motion.div
                animate={{ y: isDark ? -30 : 0 }}
                className="flex flex-col gap-8"
            >
                <Sun size={20} />
                <Moon size={20} />
            </motion.div>
        </button>
    )
}

export default ThemeToggle
