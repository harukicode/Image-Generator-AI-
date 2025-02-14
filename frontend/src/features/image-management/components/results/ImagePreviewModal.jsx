import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/shared/ui/button";

const ImagePreviewModal = ({ isOpen, onClose, imageUrl, onNext, onPrev, hasNext, hasPrev }) => {
	// Обработчик клавиатурных событий
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!isOpen) return;
			
			switch (e.key) {
				case 'ArrowLeft':
					if (hasPrev) onPrev();
					break;
				case 'ArrowRight':
					if (hasNext) onNext();
					break;
				case 'a' || 'A':
					if (hasPrev) onPrev();
					break;
				case 'd' || 'D':
					if (hasNext) onNext();
					break;
				case 'Escape':
					onClose();
					break;
			}
		};
		
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onNext, onPrev, hasNext, hasPrev, onClose]);
	
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
							{/* Кнопка закрытия */}
							<button
								onClick={onClose}
								className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors duration-200 z-50"
							>
								<X className="w-5 h-5 text-gray-700" />
							</button>
							
							{/* Навигационные кнопки */}
							{hasPrev && (
								<Button
									variant="ghost"
									size="icon"
									onClick={onPrev}
									className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white/90 transition-all"
								>
									<ChevronLeft className="w-6 h-6 text-gray-700" />
								</Button>
							)}
							
							{hasNext && (
								<Button
									variant="ghost"
									size="icon"
									onClick={onNext}
									className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white/90 transition-all"
								>
									<ChevronRight className="w-6 h-6 text-gray-700" />
								</Button>
							)}
							
							{/* Изображение */}
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