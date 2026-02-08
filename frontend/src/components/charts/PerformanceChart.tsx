import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Week 1', score: 65 },
    { name: 'Week 2', score: 68 },
    { name: 'Week 3', score: 72 },
    { name: 'Week 4', score: 70 },
    { name: 'Week 5', score: 75 },
    { name: 'Week 6', score: 78 },
    { name: 'Week 7', score: 82 },
    { name: 'Week 8', score: 85 },
];

export const PerformanceChart: React.FC = () => {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        domain={[0, 100]}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#2563EB', fontWeight: 600 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={{ fill: '#2563EB', strokeWidth: 2, r: 4, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
