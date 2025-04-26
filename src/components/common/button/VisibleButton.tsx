"use client"

interface VisibleButtonProps {
    onClick?: () => void;
}

const VisibleButton: React.FC<VisibleButtonProps> = ({ onClick }) => {
    return (
        <div className="flex justify-center mt-6">
            <button
                onClick={onClick}
                className="px-6 py-2 text-center items-center bg-[#144C68] text-white rounded-md hover:bg-[#0E3549] transition-colors cursor-pointer h-[45px]"
            >
                Load More
            </button>
        </div>
    );
};

export default VisibleButton;