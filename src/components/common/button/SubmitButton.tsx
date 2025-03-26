"use client"

interface SubmitButtonProps {
    buttonText: string;
    width: string;
    height: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ buttonText, width, height }) => {
    return (
        <button
            className="bg-[#144C68] text-white py-2 px-4 rounded-sm hover:bg-[#0E3549] transition-colors cursor-pointer"
            style={{ width: width, height: height }}
        >
            <div className="flex gap-2 justify-center text-center items-center">
                <p className="font-medium">{buttonText}</p>
            </div>
        </button>
    );
};

export default SubmitButton;