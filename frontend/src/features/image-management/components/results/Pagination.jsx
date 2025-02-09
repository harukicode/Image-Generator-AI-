import { Button } from "@/shared/ui/button.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	if (totalPages <= 1) return null;
	
	return (
		<div className="flex justify-center items-center gap-4 mt-6">
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			
			<span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
			
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
};