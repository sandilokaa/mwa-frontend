import React from 'react';

interface Schedule {
    id: number;
    scheduleName: string;
    startDate?: string | Date;
    endDate?: string | Date;
    pic?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface ScheduleTooltipProps {
    schedule: Schedule | null;
    position: { x: number; y: number };
    isVisible: boolean;
    className?: string;
}

const ScheduleTooltip: React.FC<ScheduleTooltipProps> = ({ 
    schedule, 
    position, 
    isVisible, 
    className = '' 
}) => {
    if (!isVisible || !schedule) return null;

    const formatDate = (date: string | Date | undefined): string => {
        if (!date) return 'N/A';
        try {
            return new Date(date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <>
            <div 
                className="fixed inset-0 z-40 pointer-events-none"
                style={{ zIndex: 49 }}
            />
            
            <div
                className={`
                    fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl 
                    min-w-[300px] max-w-[420px] animate-in fade-in duration-200
                    ${className}
                `}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, calc(-100% - 12px))',
                }}
            >
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-gray-300"></div>
                    <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-white absolute top-[-1px] left-1/2 transform -translate-x-1/2"></div>
                </div>
                
                <div className="p-4">
                    <div className="border-b border-gray-200 pb-3 mb-3">
                        <h4 className="font-semibold text-gray-900 text-sm">
                            {schedule.scheduleName}
                        </h4>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <span className="text-sm font-medium">
                                    Start Date
                                </span>
                                <p className="text-sm mt-1">
                                    {formatDate(schedule.startDate)}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium">
                                    End Date
                                </span>
                                <p className="text-sm mt-1">
                                    {formatDate(schedule.endDate)}
                                </p>
                            </div>
                        </div>
                        
                        {schedule.pic && (
                            <div>
                                <span className="text-sm font-medium">
                                    Person in Charge
                                </span>
                                <div className="flex items-center mt-1">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                                        <span className="text-white text-xs font-medium">
                                            {schedule.pic.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{schedule.pic}</p>
                                </div>
                            </div>
                        )}
                        
                        {schedule.status && (
                            <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Status
                                </span>
                                <div className="mt-1">
                                    <span className={`
                                        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                        ${getStatusColor(schedule.status)}
                                    `}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></div>
                                        {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1).replace('-', ' ')}
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        {schedule.progress !== undefined && schedule.progress !== null && (
                            <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Progress
                                </span>
                                <div className="mt-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-700">{schedule.progress}% completed</span>
                                        <span className="text-xs text-gray-500">{schedule.progress}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className={`
                                                h-full rounded-full transition-all duration-300 ease-out
                                                ${schedule.progress >= 100 ? 'bg-green-500' : 
                                                    schedule.progress >= 75 ? 'bg-blue-500' : 
                                                    schedule.progress >= 50 ? 'bg-yellow-500' : 'bg-orange-500'}
                                            `}
                                            style={{ width: `${Math.min(Math.max(schedule.progress, 0), 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScheduleTooltip;