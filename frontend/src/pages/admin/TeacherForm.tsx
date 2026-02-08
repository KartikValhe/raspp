import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const TeacherForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        full_name: '',
        department: '',
        email: 'teacher@example.com',
        password: 'password123'
    });

    useEffect(() => {
        if (isEditMode) {
            api.get(`/api/v1/teachers/${id}`).then(res => {
                setFormData({
                    full_name: res.data.full_name,
                    department: res.data.department,
                    email: 'teacher@example.com', // placeholder
                    password: ''
                });
            });
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await api.put(`/api/v1/teachers/${id}`, formData);
            } else {
                await api.post('/api/v1/teachers', formData);
            }
            navigate('/teachers');
        } catch (error) {
            console.error("Failed to save teacher", error);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Teacher' : 'Add Teacher'}</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                />
                <Input
                    label="Department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                />
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
                    <Button type="button" variant="secondary" onClick={() => navigate('/teachers')}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </div>
    );
};
