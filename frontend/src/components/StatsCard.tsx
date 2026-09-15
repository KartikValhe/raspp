import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    /** tailwind text-color + dark variant, e.g. "text-primary-600 dark:text-primary-400" */
    colorClass?: string;
    delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    label,
    value,
    icon: Icon,
    trend,
    colorClass = 'text-primary-600 dark:text-primary-400',
    delay = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
            className="stat-card group hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
        >
            {/* Watermark icon */}
            <div className={`absolute top-0 right-0 p-4 opacity-[0.07] group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-300 ${colorClass}`}>
                <Icon size={60} strokeWidth={1.5} />
            </div>

            <div className="relative z-10">
                {/* Icon badge */}
                <div className={`stat-card-icon ${colorClass}`}>
                    <Icon size={22} strokeWidth={2} />
                </div>

                <p className="stat-card-label">{label}</p>

                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="stat-card-value">{value}</h3>
                    {trend && (
                        <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend.isPositive
                                ? 'text-success-600 dark:text-success-500'
                                : 'text-danger-500 dark:text-danger-400'
                            }`}>
                            {trend.isPositive
                                ? <ArrowUpRight size={12} />
                                : <ArrowDownRight size={12} />
                            }
                            {trend.isPositive ? '+' : ''}{trend.value}%
                        </span>
                    )}
                </div>

                {trend && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                        vs last month
                    </p>
                )}
            </div>
        </motion.div>
    );
};
