"use client";

import React, { forwardRef } from "react";

import DateInputForm from "../input/DateInputFrom";

interface OverdueModalProps {
    open: boolean;
    onClose: () => void;
    issue: {
        id: number;
        itemName: string;
    };
    onSave: () => void;
}

const OverdueModal = forwardRef<HTMLInputElement, OverdueModalProps>(({
    open,
    onClose,
    onSave,
    issue
}, ref) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
            <div className="flex flex-col gap-4 bg-white p-6 rounded-lg w-[360px] shadow-lg text-left">
                <h2 className="text-lg font-semibold text-[#D62C35]">Date Revision</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-sm">
                        Issue <strong>{issue.itemName}</strong> has passed the deadline.
                    </p>
                    <DateInputForm
                        label="Revision Date *"
                        ref={ref}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="text-sm px-4 py-2 rounded bg-gray-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="text-sm px-4 py-2 rounded bg-[#D62C35] text-white cursor-pointer"
                    >
                        Save Date
                    </button>
                </div>
            </div>
        </div>
    );
});

OverdueModal.displayName = "OverdueModal";

export default OverdueModal;