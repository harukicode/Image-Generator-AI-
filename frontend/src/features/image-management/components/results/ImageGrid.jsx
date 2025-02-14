import { useDeleteImage } from '@/features/image-management/components/library/hooks/useDeleteImages.jsx'
import { useImageContext } from '@/features/image-management/components/ui/ImageContext.jsx'
import { Download } from "lucide-react"
import { Button } from "@/shared/ui/button.jsx"
import { ImageCard } from "./ImageCard"
import { Pagination } from "./Pagination"
import { useImageGrid } from "../../hooks/useImageGrid"
import DownloadDialog from "../ui/download-dialog.jsx"
import { useState, useEffect } from 'react'

export const ImageGrid = ({ images, onImageDelete }) => {
	const [localImages, setLocalImages] = useState(images)
	const { isImageDeleted, markImageAsDeleted } = useImageContext();
	
	
	useEffect(() => {
		const filteredImages = images.filter(img => {
			const filename = typeof img === 'string'
				? img.split('/').pop()
				: img.filename;
			return !isImageDeleted(filename);
		});
		setLocalImages(filteredImages);
	}, [images, isImageDeleted]);
	
	const {
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
	} = useImageGrid(localImages)
	
	const { deleteImage, isDeleting } = useDeleteImage();
	
	const handleDelete = (image) => {
		const filename = typeof image === 'string'
			? image.split('/').pop()
			: (image.filename || image.id?.toString());
		
		console.log('Handling delete for image:', { image, filename });
		
		deleteImage(image, () => {
			console.log('Delete success callback for image:', { image, filename });
			
			setLocalImages(prev => prev.filter(img => {
				const currentFilename = typeof img === 'string'
					? img.split('/').pop()
					: (img.filename || img.id?.toString());
				return currentFilename !== filename;
			}));
			
			
			onImageDelete?.(filename);
		});
	};
	
	if (!localImages?.length) {
		return (
			<div className="text-center text-gray-500 p-8">
				No images available
			</div>
		)
	}
	
	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
				<div className="text-sm text-gray-500">{selectedImages.size} images selected</div>
				{selectedImages.size > 0 && (
					<Button onClick={() => setIsDownloadDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
						<Download className="h-4 w-4 mr-2" />
						Download Selected ({selectedImages.size})
					</Button>
				)}
			</div>
			
			<DownloadDialog
				isOpen={isDownloadDialogOpen}
				onClose={() => setIsDownloadDialogOpen(false)}
				onDownload={downloadSelectedImages}
			/>
			
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
				{getCurrentPageImages().map((image, index) => (
					<ImageCard
						key={typeof image === 'string' ? image : image.id}
						image={image}
						index={index}
						isSelected={selectedImages.has(image)}
						isHovered={hoveredImage === image}
						onSelect={toggleImageSelection}
						onDelete={handleDelete}
						onHover={setHoveredImage}
						isDeleting={isDeleting(image)}
						allImages={getCurrentPageImages()}
					/>
				))}
			</div>
			
			<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
		</div>
	)
}