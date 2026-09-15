import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
    /** Page icon from lucide-react */
    icon: LucideIcon;
    /** Main heading — always renders as h1 */
    title: string;
    /** Optional subtitle below the title */
    subtitle?: string;
    /** Right-side content: buttons, badges, pills */
    actions?: React.ReactNode;
    /** Optional icon background override (default: bg-primary-500) */
    iconClass?: string;
}

/**
 * PageHeader — Standardized header used on every page.
 * Ensures consistent: icon size, h1 font-size, subtitle style,
 * spacing, and right-side action alignment.
 *
 * Usage:
 *   <PageHeader
 *     icon={Users}
 *     title="Teachers"
 *     subtitle="Manage faculty members"
 *     actions={<button className="btn-primary">Add Teacher</button>}
 *   />
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
    icon: Icon,
    title,
    subtitle,
    actions,
    iconClass = 'bg-primary-500',
}) => (
    <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between mb-6"
    >
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-primary shrink-0 ${iconClass}`}>
                <Icon size={20} strokeWidth={2} />
            </div>
            <div>
                {/* h1 — ALWAYS text-2xl (22px) — the only heading size for page titles */}
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>

        {/* Right: Actions */}
        {actions && (
            <div className="flex items-center gap-2">
                {actions}
            </div>
        )}
    </motion.div>
);
