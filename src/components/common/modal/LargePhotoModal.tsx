'use client'

import Image from "next/image";

interface LargeModalProps {
    open: boolean;
    onClose: () => void;
    imgUrl: string;
    downloadUrl?: string;
}

const LargePhotoModal: React.FC<LargeModalProps> = ({
    open,
    onClose,
    imgUrl,
    downloadUrl
}) => {

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
            <div className="flex flex-col gap-4 bg-white px-6 py-4 rounded shadow-md">
                <div
                    className="flex justify-between items-center py-2"
                >
                    <div className="flex">
                        <p className="font-bold">Supporting Documents</p>
                    </div>
                    <div onClick={onClose} className="p-1 border border-[#F5F6F8] rounded-sm">
                        <Image className="cursor-pointer h-[16px] w-[16px]" src="/images/icon/close.svg" alt="close icon" height={20} width={20}/>
                    </div>
                </div>
                <div className="flex">
                    <Image src={imgUrl} alt="Detail Image" width={900} height={500}/>
                </div>
                <div className="flex gap-2 font-medium justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-transparent border border-[#F5F6F8] rounded cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 text-sm bg-[#144C68] rounded cursor-pointer text-white"
                    >
                        <a className="text-sm font-medium text-white" download href={downloadUrl}>Download</a>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LargePhotoModal;