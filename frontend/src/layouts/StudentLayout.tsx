import React from 'react';
import { StudentSidebar } from '../components/StudentSidebar';

export const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0c] overflow-hidden selection:bg-indigo-500/30 transition-colors duration-300">
            {/* Sidebar */}
            <StudentSidebar />

            {/* Main content area */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                {/* Background ambient effects */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] opacity-30" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] opacity-20" />
                </div>

                <div className="absolute inset-0 w-full h-full z-10">
                    {children}
                </div>
            </main>
        </div>
    );
};
