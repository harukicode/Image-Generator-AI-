import { useDeleteImage } from '@/features/image-management/components/library/hooks/useDeleteImages.jsx'
import { Download } from "lucide-react"
import { Button } from "@/shared/ui/button.jsx"
import { ImageCard } from "./ImageCard"
import { Pagination } from "./Pagination"
import { useImageGrid } from "../../hooks/useImageGrid"
import DownloadDialog from "../ui/download-dialog.jsx"

export const ImageGrid = ({ images, onImageDelete }) => {
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
	} = useImageGrid(images)
	
	const { deleteImage, isDeleting } = useDeleteImage();
	
	const handleDelete = (image) => {
		deleteImage(image, () => onImageDelete(image));
	};
	
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
			
			<div className="text-sm text-gray-500 text-center">
				<div>
					Showing {Math.min(12, images.length - (currentPage - 1) * 12)} of {images.length} images
				</div>
			</div>
			
			<DownloadDialog
				isOpen={isDownloadDialogOpen}
				onClose={() => setIsDownloadDialogOpen(false)}
				onDownload={downloadSelectedImages}
			/>
			
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
				{getCurrentPageImages().map((image, index) => (
					<ImageCard
						key={image}
						image={image}
						index={index}
						isSelected={selectedImages.has(image)}
						isHovered={hoveredImage === image}
						onSelect={toggleImageSelection}
						onDelete={handleDelete}
						onHover={setHoveredImage}
						isDeleting={isDeleting(image)}
					/>
				))}
			</div>
			
			<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
		</div>
	)
}