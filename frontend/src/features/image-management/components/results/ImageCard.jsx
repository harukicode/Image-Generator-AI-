import { motion } from "framer-motion";
import { Trash2, Maximize2 } from "lucide-react";
import { Button } from "@/shared/ui/button.jsx";
import { useState, useEffect } from "react";
import ImagePreviewModal from "./ImagePreviewModal";

export const ImageCard = ({
	                          image,
	                          imageUrl,
	                          index,
	                          isSelected,
	                          isHovered,
	                          isDeleting,
	                          onSelect,
	                          onDelete,
	                          onHover,
	                          allImages,
                          }) => {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(index);
	const [isLoaded, setIsLoaded] = useState(false);
	
	useEffect(() => {
		const img = new Image();
		img.src = imageUrl;
		img.onload = () => setIsLoaded(true);
	}, [imageUrl]);
	
	const handleNext = () => {
		if (currentImageIndex < allImages.length - 1) {
			setCurrentImageIndex(prev => prev + 1);
		}
	};
	
	const handlePrev = () => {
		if (currentImageIndex > 0) {
			setCurrentImageIndex(prev => prev - 1);
		}
	};
	
	const getCurrentImageUrl = () => {
		const currentImage = allImages[currentImageIndex];
		return `http://localhost:3000${currentImage}`;
	};
	
	return (
		<>
			<motion.div
				className="relative aspect-square group"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: isDeleting ? 0.5 : 1, scale: 1 }}
				transition={{ duration: 0.2 }}
				onMouseEnter={() => onHover(image)}
				onMouseLeave={() => onHover(null)}
				onClick={() => onSelect(image)}
			>

				{!isLoaded && (
					<div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
				)}
				

				<img
					src={imageUrl}
					alt={`Generated ${index + 1}`}
					className={`w-full h-full object-cover rounded-lg transition-all duration-200
            ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''}
            ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
					style={{ position: isLoaded ? 'relative' : 'absolute' }}
				/>
				
				{isLoaded && (
					<div
						className={`absolute inset-0 bg-black/40 transition-opacity duration-200 rounded-lg ${
							isHovered ? 'opacity-100' : 'opacity-0'
						}`}
					>
						<div className="absolute top-2 right-2 flex gap-2">
							<Button
								variant="secondary"
								size="icon"
								className="w-8 h-8 bg-white/80 hover:bg-white"
								onClick={(e) => {
									e.stopPropagation();
									setIsPreviewOpen(true);
								}}
								disabled={isDeleting}
							>
								<Maximize2 className="h-4 w-4" />
							</Button>
							
							<Button
								variant="secondary"
								size="icon"
								className="w-8 h-8 bg-white/80 hover:bg-white"
								onClick={(e) => {
									e.stopPropagation();
									onDelete(image);
								}}
								disabled={isDeleting}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				)}
				
				{isDeleting && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <span className="text-white text-sm font-medium">
              Deleting... Click 'Undo' to cancel
            </span>
					</div>
				)}
			</motion.div>
			
			<ImagePreviewModal
				isOpen={isPreviewOpen}
				onClose={() => setIsPreviewOpen(false)}
				imageUrl={getCurrentImageUrl()}
				onNext={handleNext}
				onPrev={handlePrev}
				hasNext={currentImageIndex < allImages.length - 1}
				hasPrev={currentImageIndex > 0}
			/>
		</>
	);
};