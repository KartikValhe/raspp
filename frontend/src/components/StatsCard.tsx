import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'blue' | 'green' | 'red' | 'purple';
    delay?: number;
}

const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    green: "bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    red: "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    purple: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
};

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, trend, color, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</h3>
                </div>
                <div className={clsx("p-3 rounded-lg", colorMap[color])}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                    <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
                        {trend.isPositive ? "+" : ""}{trend.value}%
                    </span>
                    <span className="text-slate-400">vs last month</span>
                </div>
            )}
        </motion.div>
    );
};
