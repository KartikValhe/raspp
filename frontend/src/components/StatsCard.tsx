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
<<<<<<< HEAD
    /** tailwind text-color + dark variant, e.g. "text-primary-600 dark:text-primary-400" */
    colorClass?: string;
=======
    /** Icon background class e.g. "bg-primary-50 dark:bg-primary-500/10" */
    iconBg?: string;
    /** Icon color class e.g. "text-primary-600 dark:text-primary-400" */
    iconColor?: string;
    /** Watermark color class e.g. "text-primary-500" */
    watermarkColor?: string;
>>>>>>> 00b89d956b0fe40e965478a45ecaea6d4c89e69e
    delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
<<<<<<< HEAD
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
=======
    label, value, icon: Icon, trend,
    iconBg = 'bg-primary-50 dark:bg-primary-500/10',
    iconColor = 'text-primary-600 dark:text-primary-400',
    watermarkColor = 'text-primary-500',
    delay = 0,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay }}
        className="stat-card group"
    >
        {/* Watermark — class-based only */}
        <div className={`absolute -right-2 -top-2 ${watermarkColor} opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-200`}>
            <Icon size={68} strokeWidth={1} />
        </div>

        <div className="relative z-10">
            <div className={`stat-card-icon ${iconBg} ${iconColor}`}>
                <Icon size={20} strokeWidth={2} />
            </div>

            <p className="stat-card-label">{label}</p>

            <div className="flex items-baseline gap-2 mt-0.5">
                <span className="stat-card-value">{value}</span>
                {trend && (
                    <span className={`text-xs font-bold flex items-center ${trend.isPositive
                            ? 'text-success-600 dark:text-success-500'
                            : 'text-danger-500'
                        }`}>
                        {trend.isPositive
                            ? <ArrowUpRight size={11} />
                            : <ArrowDownRight size={11} />
                        }
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                )}
            </div>

            {trend && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">vs last month</p>
            )}
        </div>
    </motion.div>
);
>>>>>>> 00b89d956b0fe40e965478a45ecaea6d4c89e69e
