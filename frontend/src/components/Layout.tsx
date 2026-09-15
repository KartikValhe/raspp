import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
<<<<<<< HEAD
        <div className="flex h-screen bg-surface-50 dark:bg-surface-950 overflow-hidden transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <div className="absolute inset-0 w-full h-full overflow-y-auto scrollbar-thin">
=======
        <div className="flex h-screen bg-surface-50 dark:bg-[#0a0a0c] overflow-hidden selection:bg-primary-500/30 transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                {/* Background ambient effects to match modern portals */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] opacity-30" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent-600/20 rounded-full blur-[120px] opacity-20" />
                </div>

                <div className="absolute inset-0 w-full h-full overflow-y-auto scrollbar-none z-10">
>>>>>>> 00b89d956b0fe40e965478a45ecaea6d4c89e69e
                    {children}
                </div>
            </main>
        </div>
    );
};
