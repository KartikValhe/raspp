import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
            {/* Sidebar is fixed width */}
            <Sidebar />

            {/* Main content area */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <div className="absolute inset-0 w-full h-full overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
};
