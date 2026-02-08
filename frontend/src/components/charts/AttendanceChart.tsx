import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    { name: 'Present', value: 850 },
    { name: 'Absent', value: 120 },
    { name: 'Late', value: 30 },
];

const COLORS = ['#22C55E', '#EF4444', '#EAB308'];

export const AttendanceChart: React.FC = () => {
    return (
        <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-2xl font-bold text-slate-800">85%</span>
                <span className="text-xs text-slate-500 font-medium uppercase">Attendance</span>
            </div>
        </div>
    );
};
