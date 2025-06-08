'use client'

interface NotifPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const NotifPagination: React.FC<NotifPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-between items-center mt-3">
            <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
            className="text-sm font-medium px-3 py-1 bg-[#FEF2F3] text-[#EB575F] rounded disabled:opacity-50 cursor-pointer"
            >
            Prev
            </button>
            <span className="text-sm font-medium">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
            onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages}
            className="text-sm font-medium px-3 py-1 bg-[#FEF2F3] text-[#EB575F] rounded disabled:opacity-50 cursor-pointer"
            >
            Next
            </button>
        </div>
    );
};

export default NotifPagination;