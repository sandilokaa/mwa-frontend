"use client"

interface ReadOnlyFormProps {
    label: string;
    defaultValue: string;
}

export default function ReadOnlyForm({ label, defaultValue }: ReadOnlyFormProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                defaultValue={defaultValue}
                readOnly
                className="border border-gray-300 rounded-lg px-3 py-2 h-[45px] text-black text-sm"
            />
        </div>
    );
};
