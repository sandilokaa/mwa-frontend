"use client"

import Image from "next/image";

interface DocumentBadgeProps {
    text: string;
}

const DocumentBadge: React.FC<DocumentBadgeProps> = ({ text }) => {
    return (
        <div className="inline-flex items-center gap-3 bg-[#DDEDFF] text-[#144C68] py-2 px-4 rounded-md cursor-pointer h-[45px] w-fit">
            <Image src="/images/icon/document-upload-blue.svg" alt="Document Icon" width={20} height={20} />
            <p className="font-medium">{text}</p>
            <Image src="/images/icon/download-blue.svg" alt="Download Icon" width={20} height={20} />
        </div>
    );
};

export default DocumentBadge;