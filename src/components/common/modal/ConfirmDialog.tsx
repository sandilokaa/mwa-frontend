"use client";

import React from "react";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md min-w-[300px]">
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="mb-5 text-sm text-black">{message}</p>
                <div className="flex justify-end gap-3 font-medium">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-300 rounded cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm bg-[#D62C35] text-white rounded cursor-pointer"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
