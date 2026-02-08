import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

interface Branch {
    id: number;
    name: string;
    code: string;
}

export const StudentForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [branches, setBranches] = useState<Branch[]>([]);

    const [formData, setFormData] = useState({
        student_id: '',
        full_name: '',
        current_semester: 1,
        branch_id: '', // Empty initially
        section: '',
        email: 'student@example.com', // Default or handled separately
        password: 'password123'
    });

    useEffect(() => {
        // Fetch Branches
        api.get('/api/v1/branches/').then(res => setBranches(res.data));

        if (isEditMode) {
            api.get(`/api/v1/students/${id}`).then(res => {
                setFormData({
                    student_id: res.data.student_id,
                    full_name: res.data.full_name,
                    current_semester: res.data.current_semester,
                    branch_id: res.data.branch_id || '',
                    section: res.data.section || '',
                    email: res.data.email || '', // Use email from API
                    password: ''
                });
            });
        } else {
            // New Student: Fetch Next ID
            api.get('/api/v1/students/next_id').then(res => {
                setFormData(prev => ({ ...prev, student_id: res.data }));
            });
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                branch_id: formData.branch_id ? parseInt(formData.branch_id.toString()) : null,
                section: formData.section
            };

            if (isEditMode) {
                await api.put(`/api/v1/students/${id}`, payload);
            } else {
                await api.post('/api/v1/students', payload);
            }
            navigate('/students');
        } catch (error: any) {
            console.error("Failed to save student", error.response?.data || error);
            alert(`Failed to save: ${JSON.stringify(error.response?.data?.detail || error.message)}`);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Student ID (Roll No)"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    required
                    disabled={isEditMode}
                />
                <Input
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                />

                {/* Branch Selection */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Branch
                    </label>
                    <select
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                        value={formData.branch_id}
                        onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                        required
                    >
                        <option value="">Select Branch</option>
                        {branches.map(b => (
                            <option key={b.id} value={b.id}>
                                {b.name} ({b.code})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Current Semester"
                        type="number"
                        value={formData.current_semester}
                        onChange={(e) => setFormData({ ...formData, current_semester: parseInt(e.target.value) })}
                        required
                    />
                    <Input
                        label="Division"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        placeholder="e.g. A"
                    />
                </div>
                {!isEditMode && (
                    <>
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </>
                )}

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="secondary" onClick={() => navigate('/students')}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </div>
    );
};
