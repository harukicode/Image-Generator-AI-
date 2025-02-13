import { useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";

export const useGeneratedImagesGrid = (images) => {
	const [selectedImages, setSelectedImages] = useState(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const { toast } = useToast();
	
	const ITEMS_PER_PAGE = 12;
	const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
	
	const getCurrentPageImages = () => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		const end = start + ITEMS_PER_PAGE;
		return images.slice(start, end);
	};
	
	const toggleImageSelection = (image) => {
		setSelectedImages(prev => {
			const newSelected = new Set(prev);
			if (newSelected.has(image)) {
				newSelected.delete(image);
			} else {
				newSelected.add(image);
			}
			return newSelected;
		});
	};
	
	const clearSelection = () => {
		setSelectedImages(new Set());
	};
	
	return {
		selectedImages,
		currentPage,
		totalPages,
		getCurrentPageImages,
		toggleImageSelection,
		setCurrentPage,
		clearSelection,
	};
};