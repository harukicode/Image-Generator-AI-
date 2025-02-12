import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ImagePreviewModal = ({ isOpen, onClose, imageUrl }) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-0 bg-transparent shadow-none">
				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className="relative"
						>
							<button
								onClick={onClose}
								className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors duration-200 z-50"
							>
								<X className="w-5 h-5 text-gray-700" />
							</button>
							
							<img
								src={imageUrl}
								alt="Preview"
								className="rounded-lg max-w-full max-h-[80vh] object-contain mx-auto"
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
};

export default ImagePreviewModal;