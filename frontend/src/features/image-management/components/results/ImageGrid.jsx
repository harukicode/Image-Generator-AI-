import { useDeleteImage } from '@/features/image-management/components/library/hooks/useDeleteImages.jsx'
import { useImageContext } from '@/features/image-management/components/ui/ImageContext.jsx'
import { Download } from "lucide-react"
import { Button } from "@/shared/ui/button.jsx"
import { ImageCard } from "./ImageCard"
import { Pagination } from "./Pagination"
import { useImageGrid } from "../../hooks/useImageGrid"
import { useImageCache } from "../../hooks/useImageCache"
import DownloadDialog from "../ui/download-dialog.jsx"
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from "framer-motion"

const variants = {
	enter: (direction) => ({
		x: direction > 0 ? 100 : -100,
		opacity: 0
	}),
	center: {
		x: 0,
		opacity: 1
	},
	exit: (direction) => ({
		x: direction < 0 ? 100 : -100,
		opacity: 0
	})
};

export const ImageGrid = ({ images, onImageDelete }) => {
	const [localImages, setLocalImages] = useState(images);
	const [direction, setDirection] = useState(0);
	const { isImageDeleted } = useImageContext();
	const { preloadImages, getCachedImage } = useImageCache(images);
	
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
	
	// Предзагрузка текущей, следующей и предыдущей страниц
	useEffect(() => {
		const preloadCurrentAndAdjacentPages = async () => {
			const pageSize = 12;
			const start = Math.max(0, (currentPage - 2) * pageSize);
			const end = Math.min(localImages.length, (currentPage + 1) * pageSize);
			
			const imagesToPreload = localImages.slice(start, end);
			await preloadImages(imagesToPreload);
		};
		
		preloadCurrentAndAdjacentPages();
	}, [currentPage, localImages, preloadImages]);
	
	const { deleteImage, isDeleting } = useDeleteImage();
	
	const handleDelete = (image) => {
		const filename = typeof image === 'string'
			? image.split('/').pop()
			: (image.filename || image.id?.toString());
		
		deleteImage(image, () => {
			setLocalImages(prev => prev.filter(img => {
				const currentFilename = typeof img === 'string'
					? img.split('/').pop()
					: (img.filename || img.id?.toString());
				return currentFilename !== filename;
			}));
			
			onImageDelete?.(filename);
		});
	};
	
	const getGlobalIndex = (localIndex) => {
		return (currentPage - 1) * 12 + localIndex;
	};
	
	const handlePageChange = (newPage) => {
		if (newPage === currentPage) return;
		setDirection(newPage > currentPage ? 1 : -1);
		setCurrentPage(newPage);
	};
	
	const currentImages = getCurrentPageImages();
	
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
			
			<div style={{ minHeight: '450px' }} className="relative overflow-hidden">
				<AnimatePresence mode="wait" custom={direction}>
					<motion.div
						key={currentPage}
						custom={direction}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 }
						}}
						className="absolute w-full"
					>
						<motion.div
							layout
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
						>
							{currentImages.map((image, index) => (
								<motion.div
									key={typeof image === 'string' ? image : image.id}
									layout
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{
										opacity: { duration: 0.2 },
										scale: { duration: 0.2 },
										layout: { duration: 0.2 }
									}}
								>
									<ImageCard
										image={image}
										imageUrl={getCachedImage(image)}
										index={getGlobalIndex(index)}
										isSelected={selectedImages.has(image)}
										isHovered={hoveredImage === image}
										onSelect={toggleImageSelection}
										onDelete={handleDelete}
										onHover={setHoveredImage}
										isDeleting={isDeleting(image)}
										allImages={localImages}
									/>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</AnimatePresence>
				
				{currentImages.length === 0 && (
					<div className="flex items-center justify-center h-full">
						<div className="text-center text-gray-500">
							No images available
						</div>
					</div>
				)}
			</div>
			
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>
		</div>
	)
}