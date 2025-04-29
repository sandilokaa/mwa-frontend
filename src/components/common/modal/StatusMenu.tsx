import { useEffect, useRef } from 'react';

interface StatusMenuProps {
    selectedStatus: string;
    onToggle: (status: string) => void;
    onSave: () => void;
    onClose: () => void;
}

const StatusMenu = ({ selectedStatus, onToggle, onSave, onClose }: StatusMenuProps) => {
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
            {['On Progress', 'Finish', 'Late'].map((status) => (
                <label key={status} className="flex items-center gap-2 py-1">
                    <input
                        type="checkbox"
                        checked={selectedStatus.toLowerCase() === status.toLowerCase()}
                        onChange={() => onToggle(status)}
                    />
                    <span
                        className={`
                            px-2 py-1 rounded text-xs w-full
                            ${status === 'On Progress' && 'bg-[#FFF9C4] text-[#ae8c02]'}
                            ${status === 'Finish' && 'bg-[#DBF2F2] text-[#3e9c9c]'}
                            ${status === 'Late' && 'bg-[#FEF2F3] text-[#EB575F]'}
                        `}
                    >
                        {status}
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
