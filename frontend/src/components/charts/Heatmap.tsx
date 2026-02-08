import React from 'react';
import { clsx } from 'clsx';
import { Tooltip } from 'recharts'; // reusing recharts tooltip style if possible, or custom

interface HeatmapProps {
    data: { date: string; value: number }[]; // value: 0=Absent, 1=Present, 2=Late
}

const getColor = (value: number) => {
    switch (value) {
        case 0: return 'bg-red-200 hover:bg-red-300';
        case 1: return 'bg-green-500 hover:bg-green-600';
        case 2: return 'bg-yellow-400 hover:bg-yellow-500';
        default: return 'bg-gray-100';
    }
};

const getLabel = (value: number) => {
    switch (value) {
        case 0: return 'Absent';
        case 1: return 'Present';
        case 2: return 'Late';
        default: return 'No Data';
    }
}

export const AttendanceHeatmap: React.FC<HeatmapProps> = ({ data }) => {
    return (
        <div className="w-full overflow-x-auto">
            <div className="flex gap-1 min-w-max">
                {data.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-800 text-white text-xs p-2 rounded z-10 whitespace-nowrap">
                            <span className="font-bold">{day.date}</span>
                            <span>{getLabel(day.value)}</span>
                        </div>

                        {/* Cell */}
                        <div
                            className={clsx(
                                "w-3 h-12 rounded-sm transition-colors cursor-pointer",
                                getColor(day.value)
                            )}
                        />
                        {/* Weekday Label (every 5th day roughly) */}
                        {i % 5 === 0 && (
                            <span className="text-[10px] text-slate-400 font-mono">{day.date.split('-')[2]}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-slate-500">
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-sm"></span> Present</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-sm"></span> Late</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-200 rounded-sm"></span> Absent</div>
            </div>
        </div>
    );
};
