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

    return (
        <div className="w-full">
            {/* Mobile Card View (Visible on < md) */}
            <div className="md:hidden flex flex-col gap-3">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm animate-pulse space-y-3">
                            <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-1/2"></div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))
                ) : sortedData.length > 0 ? (
                    sortedData.map((row, i) => {
                        const titleCol = columns.find(c => c.key === 'full_name' || c.key === 'name' || c.key === 'title') || columns[0];
                        const actionCol = columns.find(c => c.key.toLowerCase().includes('action') || c.label.toLowerCase().includes('action'));
                        const detailCols = columns.filter(c => c.key !== titleCol?.key && c.key !== actionCol?.key);

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: i * 0.04 }}
                                className={clsx(
                                    "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3",
                                    onRowClick && "cursor-pointer active:scale-[0.99]"
                                )}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {/* Card Header: Title on Left, Action on Right */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="font-semibold text-slate-900 dark:text-white text-sm flex-1 min-w-0">
                                        {titleCol?.render ? titleCol.render(row) : (titleCol ? row[titleCol.key] : null)}
                                    </div>
                                    {actionCol && (
                                        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                            {actionCol.render ? actionCol.render(row) : row[actionCol.key]}
                                        </div>
                                    )}
                                </div>

                                {/* Card Details: Key-Value Grid */}
                                {detailCols.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-100 dark:border-white/5 text-xs">
                                        {detailCols.map(col => (
                                            <div key={col.key} className="flex flex-col">
                                                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                    {col.label}
                                                </span>
                                                <div className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                                                    {col.render ? col.render(row) : row[col.key]}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400">
                        {emptyMessage}
                    </div>
                )}
            </div>

            {/* Desktop Table View (Hidden on < md, visible on md+) */}
            <div className={clsx("hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-white/5", className)}>
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
        </div>
    );
}
