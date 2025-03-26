"use client"
import Image from "next/image";

interface AddButtonProps {
    buttonText: string;
    width: string;
    height: string;
}

const AddButton: React.FC<AddButtonProps> = ({ buttonText, width, height }) => {
    return (
        <button
            className="bg-[#144C68] text-white py-2 px-4 rounded-sm hover:bg-[#0E3549] transition-colors cursor-pointer"
            style={{ width: width, height: height }}
        >
            <div className="flex gap-2 justify-between text-center items-center">
                <p className="font-medium">{buttonText}</p>
                <Image src="/images/icon/add.svg" alt="Add Icon" height={20} width={20}/>
            </div>
        </button>
    );
};

export default AddButton;