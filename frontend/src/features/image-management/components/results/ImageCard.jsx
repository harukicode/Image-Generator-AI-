import { motion } from "framer-motion";
import { Trash2, Maximize2 } from "lucide-react";
import { Button } from "@/shared/ui/button.jsx";
import { useState } from "react";
import ImagePreviewModal from "./ImagePreviewModal";

export const ImageCard = ({
	                          image,
	                          index,
	                          isSelected,
	                          isHovered,
	                          onSelect,
	                          onDelete,
	                          onHover
                          }) => {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const imageUrl = `http://localhost:3000${image}`;
	
	return (
		<>
			<motion.div
				className="relative aspect-square group cursor-pointer"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: index * 0.1 }}
				onMouseEnter={() => onHover(image)}
				onMouseLeave={() => onHover(null)}
				onClick={() => onSelect(image)}
			>
				<img
					src={imageUrl}
					alt={`Generated ${index + 1}`}
					className={`w-full h-full object-cover rounded-lg transition-all duration-200 ${
						isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''
					}`}
				/>
				
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
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</motion.div>
			
			<ImagePreviewModal
				isOpen={isPreviewOpen}
				onClose={() => setIsPreviewOpen(false)}
				imageUrl={imageUrl}
			/>
		</>
	);
};

export default ImageCard;