'use client'

import { useEffect, useRef } from 'react';

export interface StatusOption {
    label: string;
    bgColor: string;
    textColor: string;
}

interface StatusMenuProps {
    selectedStatus: string;
    onToggle: (status: string) => void;
    onSave: () => void;
    onClose: () => void;
    statusOptions: StatusOption[];
}

const StatusMenu = ({
    selectedStatus,
    onToggle,
    onSave,
    onClose,
    statusOptions,
}: StatusMenuProps) => {
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
            className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded z-50 p-3"
        >
            {statusOptions.map(({ label, bgColor, textColor }) => (
                <label key={label} className="flex items-center gap-2 py-1">
                <input
                    type="checkbox"
                    checked={selectedStatus.toLowerCase() === label.toLowerCase()}
                    onChange={() => onToggle(label)}
                />
                <span
                    className={`px-2 py-1 rounded text-xs w-full`}
                    style={{ backgroundColor: bgColor, color: textColor }}
                >
                    {label}
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

export default StatusMenu;
