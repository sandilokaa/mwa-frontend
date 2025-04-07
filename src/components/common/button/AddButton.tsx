"use client"
import Image from "next/image";

interface AddButtonProps {
    buttonText: string;
}

const AddButton: React.FC<AddButtonProps> = ({ buttonText }) => {
    return (
        <div className="flex gap-2 justify-between text-center items-center bg-[#144C68] text-white py-2 px-4 rounded-md hover:bg-[#0E3549] transition-colors cursor-pointer h-[45px]">
            <p className="font-medium">{buttonText}</p>
            <Image src="/images/icon/add.svg" alt="Add Icon" height={20} width={20}/>
        </div>
    );
};

export default AddButton;