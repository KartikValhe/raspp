import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PlacementStats: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Mock data for visualization
            const mockData = {
                branchWise: [
                    { name: 'CSE', placed: 120, total: 140 },
                    { name: 'ECE', placed: 85, total: 110 },
                    { name: 'MECH', placed: 60, total: 90 },
                    { name: 'CIVIL', placed: 40, total: 80 },
                ],
                packageDist: [
                    { range: '3-5 LPA', count: 45 },
                    { range: '5-8 LPA', count: 80 },
                    { range: '8-12 LPA', count: 35 },
                    { range: '12+ LPA', count: 15 },
                ]
            };
            setStats(mockData);
        } catch (error) {
            console.error("Error fetching stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-8 min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold mb-8">Placement Statistics</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Branch-wise Placement */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-lg"
                    >
                        <h2 className="text-xl font-bold mb-6">Department-wise Placements</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.branchWise}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.2} />
                                    <XAxis dataKey="name" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="placed" fill="#8884d8" name="Placed Students" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="total" fill="#82ca9d" name="Total Students" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Package Distribution */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-lg"
                    >
                        <h2 className="text-xl font-bold mb-6">Salary Package Distribution</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.packageDist}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="range"
                                        label
                                    >
                                        {stats.packageDist.map((_entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default PlacementStats;
