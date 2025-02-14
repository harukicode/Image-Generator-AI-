import { useState } from "react";
import axios from "axios";
import { useToast } from "@/shared/hooks/use-toast.js";

export const useImageGrid = (images, onImageDelete) => {
	const [selectedImages, setSelectedImages] = useState(new Set());
	const [hoveredImage, setHoveredImage] = useState(null);
	const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const { toast } = useToast();
	
	const ITEMS_PER_PAGE = 6;
	const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
	
	const getCurrentPageImages = () => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		const end = start + ITEMS_PER_PAGE;
		return images.slice(start, end);
	};
	
	const toggleImageSelection = (image) => {
		const newSelected = new Set(selectedImages);
		if (newSelected.has(image)) {
			newSelected.delete(image);
		} else {
			newSelected.add(image);
		}
		setSelectedImages(newSelected);
	};
	
	const downloadSelectedImages = async (companyName) => {
		try {
			const selectedImagesArray = Array.from(selectedImages);
			
			for (const [index, url] of selectedImagesArray.entries()) {
				const response = await axios({
					url: `http://localhost:3000${url}`,
					method: 'GET',
					responseType: 'blob',
				});
				
				const fileNumber = (index + 1).toString().padStart(2, '0');
				const newFilename = `${companyName}-${fileNumber}.png`;
				
				const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = downloadUrl;
				link.setAttribute('download', newFilename);
				
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				window.URL.revokeObjectURL(downloadUrl);
			}
			
			setSelectedImages(new Set());
			setIsDownloadDialogOpen(false);
			
			toast({
				title: "Success",
				description: "Images downloaded successfully",
			});
			
		} catch (error) {
			console.error('Download error:', error);
			toast({
				title: "Error",
				description: "Failed to download images",
				variant: "destructive",
			});
		}
	};
	
	return {
		selectedImages,
		hoveredImage,
		isDownloadDialogOpen,
		currentPage,
		totalPages,
		getCurrentPageImages,
		toggleImageSelection,
		setHoveredImage,
		setIsDownloadDialogOpen,
		setCurrentPage,
		downloadSelectedImages,
	};
};