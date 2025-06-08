'use client'

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center items-center gap-2 mt-3">
            {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                const isActive = currentPage === page;

                const shouldRender =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

                if (
                    (page === 2 && currentPage > 4) ||
                    (page === totalPages - 1 && currentPage < totalPages - 3)
                ) {
                    return <span key={page}>...</span>;
                }

                return (
                    shouldRender && (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`text-sm font-medium px-3 py-1 rounded cursor-pointer ${
                                isActive ? 'bg-[#EB575F] text-white' : 'bg-[#FEF2F3] text-[#EB575F]'
                            }`}
                        >
                            {page}
                        </button>
                    )
                );
            })}
        </div>
    );
};

export default TablePagination;