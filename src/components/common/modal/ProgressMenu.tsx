import { useEffect, useRef } from 'react';

interface ProgressMenuProps {
    selectedProgress: string;
    onToggle: (progress: string) => void;
    onSave: () => void;
    onClose: () => void;
}

const ProgressMenu = ({ selectedProgress, onToggle, onSave, onClose }: ProgressMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded z-50 p-3"
        >
            {['PR Approved', 'PO Confirmed', 'Paid', 'Delivered'].map((progress) => (
                <label key={progress} className="flex items-center gap-2 py-1">
                    <input
                        type="checkbox"
                        checked={selectedProgress.toLowerCase() === progress.toLowerCase()}
                        onChange={() => onToggle(progress)}
                    />
                    <span
                        className={`
                        px-2 py-1 rounded text-xs w-full
                        ${progress === 'PR Approved' && 'bg-[#DBF2F2] text-[#3e9c9c]'}
                        ${progress === 'PO Confirmed' && 'bg-[#CDEBFF] text-[#059BFF]'}
                        ${progress === 'Paid' && 'bg-[#EBE0FF] text-[#9966FF]'}
                        ${progress === 'Delivered' && 'bg-[#F4F5F5] text-[#7a7b7d]'}
                        `}
                    >
                        {progress}
                    </span>
                </label>
            ))}

            <button
                onClick={onSave}
                className="mt-3 w-full py-1 text-white bg-[#134E6F] rounded text-xs cursor-pointer"
            >
                Save
            </button>
        </div>
    );
};

export default ProgressMenu;
