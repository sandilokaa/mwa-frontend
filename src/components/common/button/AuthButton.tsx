"use client"

interface AuthButtonProps {
    buttonText: string;
    onClick?: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ buttonText, onClick }) => {
    return (
        <div 
            onClick={onClick} 
            className="flex justify-center w-full items-center bg-[#144C68] text-white py-2 px-4 rounded-md hover:bg-[#0E3549] transition-colors cursor-pointer h-[45px]"
        >
            <p className="font-medium">{buttonText}</p>
        </div>
    );
};

export default AuthButton;