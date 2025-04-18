"use client"

interface SubmitButtonProps {
    buttonText: string;
    onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ buttonText, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="flex text-center items-center bg-[#144C68] text-white py-2 px-4 rounded-md hover:bg-[#0E3549] transition-colors cursor-pointer h-[45px]"
        >
            <p className="font-medium">{buttonText}</p>
        </div>
    );
};

export default SubmitButton;