import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { createSubject, updateSubject, type Subject, type SubjectCreate, type SubjectUpdate, type Branch } from '../../services/subjectService';

interface SubjectFormProps {
    subject: Subject | null;
    branches: Branch[];
    onClose: () => void;
}

const SubjectForm = ({ subject, branches, onClose }: SubjectFormProps) => {
    const [formData, setFormData] = useState<SubjectCreate>({
        code: '',
        name: '',
        semester: 1,
        branch_id: null,
        credits: 3,
        max_marks: 100,
        description: '',
        is_active: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (subject) {
            setFormData({
                code: subject.code,
                name: subject.name,
                semester: subject.semester,
                branch_id: subject.branch_id,
                credits: subject.credits,
                max_marks: subject.max_marks,
                description: subject.description || '',
                is_active: subject.is_active
            });
        }
    }, [subject]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (subject) {
                // Update existing subject
                const updateData: SubjectUpdate = {};
                if (formData.code !== subject.code) updateData.code = formData.code;
                if (formData.name !== subject.name) updateData.name = formData.name;
                if (formData.semester !== subject.semester) updateData.semester = formData.semester;
                if (formData.branch_id !== subject.branch_id) updateData.branch_id = formData.branch_id;
                if (formData.credits !== subject.credits) updateData.credits = formData.credits;
                if (formData.max_marks !== subject.max_marks) updateData.max_marks = formData.max_marks;
                if (formData.description !== subject.description) updateData.description = formData.description || null;
                if (formData.is_active !== subject.is_active) updateData.is_active = formData.is_active;

                await updateSubject(subject.id, updateData);
            } else {
                // Create new subject
                await createSubject(formData);
            }
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {subject ? 'Edit Subject' : 'Add New Subject'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Subject Code */}
                    <div>
                        <label className="block text-purple-200 text-sm font-semibold mb-2">
                            Subject Code *
                        </label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            required
                            placeholder="e.g., CS301"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Subject Name */}
                    <div>
                        <label className="block text-purple-200 text-sm font-semibold mb-2">
                            Subject Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="e.g., Data Structures and Algorithms"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Semester and Credits Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Semester *
                            </label>
                            <select
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                required
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Credits *
                            </label>
                            <input
                                type="number"
                                value={formData.credits}
                                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                                required
                                min="1"
                                max="10"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Branch and Max Marks Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Branch (Optional)
                            </label>
                            <select
                                value={formData.branch_id || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    branch_id: e.target.value ? parseInt(e.target.value) : null
                                })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Common (All Branches)</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.code} - {branch.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-purple-300 mt-1">Leave empty for subjects common to all branches</p>
                        </div>

                        <div>
                            <label className="block text-purple-200 text-sm font-semibold mb-2">
                                Maximum Marks *
                            </label>
                            <input
                                type="number"
                                value={formData.max_marks}
                                onChange={(e) => setFormData({ ...formData, max_marks: parseFloat(e.target.value) })}
                                required
                                min="1"
                                step="0.01"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-purple-200 text-sm font-semibold mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the subject..."
                            rows={3}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-2 focus:ring-purple-500"
                        />
                        <label htmlFor="is_active" className="text-white">
                            Active Subject (uncheck to deactivate)
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50 transition-all"
                        >
                            {loading ? 'Saving...' : subject ? 'Update Subject' : 'Create Subject'}
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={onClose}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
                        >
                            Cancel
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default SubjectForm;
