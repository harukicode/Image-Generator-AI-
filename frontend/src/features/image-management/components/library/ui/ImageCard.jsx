import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";

export const ImageCard = ({
	                          image,
	                          renderOverlay,
	                          className = "",
	                          ...props
                          }) => {
	return (
		<motion.div
			className={`relative group ${className}`}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			{...props}
		>
			<img
				src={`http://localhost:3000${image.url}`}
				alt={image.originalName || "Image"}
				className="w-full aspect-square object-cover rounded-lg"
			/>
			{renderOverlay && renderOverlay(image)}
		</motion.div>
	);
};