import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-surface-50 dark:bg-surface-950 overflow-hidden transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <div className="absolute inset-0 w-full h-full overflow-y-auto scrollbar-thin">
                    {children}
                </div>
            </main>
        </div>
    );
};
