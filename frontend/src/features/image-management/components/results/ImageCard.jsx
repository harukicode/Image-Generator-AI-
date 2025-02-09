import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button.jsx";

export const ImageCard = ({
	                          image,
	                          index,
	                          isSelected,
	                          isHovered,
	                          onSelect,
	                          onDelete,
	                          onHover
                          }) => {
	return (
		<motion.div
			className="relative aspect-square group"
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: index * 0.1 }}
			onMouseEnter={() => onHover(image)}
			onMouseLeave={() => onHover(null)}
		>
			<img
				src={`http://localhost:3000${image}`}
				alt={`Generated ${index + 1}`}
				className={`w-full h-full object-cover rounded-lg transition-all duration-200 ${
					isSelected ? 'opacity-75' : ''
				}`}
			/>
			
			<div
				className={`absolute inset-0 bg-black/40 transition-opacity duration-200 rounded-lg ${
					isHovered || isSelected ? 'opacity-100' : 'opacity-0'
				}`}
			>
				<button
					onClick={() => onSelect(image)}
					className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
						isSelected ? 'bg-blue-600 border-blue-600' : 'border-white bg-transparent'
					}`}
				>
					{isSelected && <Check className="w-4 h-4 text-white" />}
				</button>
				
				<Button
					variant="secondary"
					size="icon"
					className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white"
					onClick={() => onDelete(image)}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		</motion.div>
	);
};
