import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string; // For specific cell styling like text-right
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (row: T) => void;
    className?: string;
    isLoading?: boolean;
    emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    onRowClick,
    className,
    isLoading = false,
    emptyMessage = "No data found."
}: DataTableProps<T>) {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;
        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className={clsx("overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-white/5", className)}>
            <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={clsx(
                                    "px-6 py-4 font-semibold transition-colors",
                                    col.sortable ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10" : "",
                                    col.className
                                )}
                                onClick={() => col.sortable && requestSort(col.key)}
                            >
                                <div className={clsx("flex items-center gap-2",
                                    col.className?.includes('text-center') ? 'justify-center' :
                                        col.className?.includes('text-right') ? 'justify-end' : ''
                                )}>
                                    {col.label}
                                    {col.sortable && (
                                        sortConfig?.key === col.key ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        ) : <ArrowUpDown size={14} className="opacity-30" />
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    Loading...
                                </div>
                            </td>
                        </tr>
                    ) : sortedData.length > 0 ? (
                        sortedData.map((row, i) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className={clsx(
                                    "transition-colors group",
                                    onRowClick ? "cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-500/10" : "hover:bg-slate-50 dark:hover:bg-white/5"
                                )}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={clsx("px-6 py-4 text-slate-700 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors", col.className)}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
