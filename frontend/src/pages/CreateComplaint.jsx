import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusCircle, FileText, Type, AlertCircle, Grid } from 'lucide-react'
import { complaintService } from '../services/api'

const CATEGORIES = ['General', 'Electrical', 'Plumbing', 'IT & Tech', 'Carpentry', 'Cleaning']

const CreateComplaint = () => {
    const [formData, setFormData] = useState({ title: '', description: '', category: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState({ type: '', msg: '' })
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setStatus({ type: '', msg: '' })

        try {
            await complaintService.create(formData)
            setStatus({ type: 'success', msg: 'Job created successfully!' })
            setTimeout(() => navigate('/complaints'), 1500)
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to submit. Please check your inputs.' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                    <PlusCircle className="text-indigo-600" />
                    New Request
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Describe the maintenance or service issue in detail</p>
            </div>

            <div className="glass-card p-10 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <FileText size={180} />
                </div>

                {status.msg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-8 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 border ${status.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800/50'
                            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-100 dark:border-rose-800/50'
                            }`}
                    >
                        <AlertCircle size={18} />
                        {status.msg}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                            <Grid size={16} className="text-indigo-500" />
                            Category
                        </label>
                        <select
                            required
                            className="input-field"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="" disabled>Select a category first</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                            <Type size={16} className="text-indigo-500" />
                            Incident Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. AC unit leaking in Room 402"
                            className="input-field"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                            <FileText size={16} className="text-indigo-500" />
                            Detailed Description
                        </label>
                        <textarea
                            required
                            rows="6"
                            placeholder="Please provide specifics like location, priority, and current behavior..."
                            className="input-field resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] btn-primary flex items-center justify-center gap-2"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

export default CreateComplaint
