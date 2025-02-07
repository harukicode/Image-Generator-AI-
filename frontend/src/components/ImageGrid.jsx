import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function ImageGrid({ images, onImageDelete, companyName }) {
	const [selectedImages, setSelectedImages] = useState(new Set())
	const [hoveredImage, setHoveredImage] = useState(null)
	
	const toggleImageSelection = (image) => {
		const newSelected = new Set(selectedImages)
		if (newSelected.has(image)) {
			newSelected.delete(image)
		} else {
			newSelected.add(image)
		}
		setSelectedImages(newSelected)
	}
	
	const downloadSelectedImages = async () => {
		const selectedImagesArray = Array.from(selectedImages);
		
		// Скачиваем каждое изображение
		selectedImagesArray.forEach(url => {
			const link = document.createElement('a');
			link.href = `http://localhost:3000${url}`;
			
			// Получаем исходное имя файла из URL
			const fullFilename = url.split('/').pop();
			
			// Разбиваем имя файла на части и удаляем timestamp
			const parts = fullFilename.split('-');
			// Если файл содержит timestamp (должно быть 3 части: name-timestamp-number.png)
			if (parts.length === 3) {
				const name = parts[0];
				const number = parts[2]; // Включает расширение .png
				link.download = `${name}-${number}`;
			} else {
				// Если формат другой, оставляем как есть
				link.download = fullFilename;
			}
			
			link.click();
		});
		
		// Очищаем выбор после скачивания
		setSelectedImages(new Set());
	}
	
	return (
		<div className="space-y-4">
			{/* Controls */}
			<div className="flex justify-between items-center">
				<div className="text-sm text-gray-500">
					{selectedImages.size} images selected
				</div>
				{selectedImages.size > 0 && (
					<Button
						onClick={downloadSelectedImages}
						className="bg-blue-600 hover:bg-blue-700 text-white"
					>
						<Download className="h-4 w-4 mr-2" />
						Download Selected ({selectedImages.size})
					</Button>
				)}
			</div>
			
			{/* Image Grid */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{images.map((image, index) => (
					<motion.div
						key={image}
						className="relative aspect-square group"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: index * 0.1 }}
						onMouseEnter={() => setHoveredImage(image)}
						onMouseLeave={() => setHoveredImage(null)}
					>
						<img
							src={`http://localhost:3000${image}`}
							alt={`Generated ${index + 1}`}
							className={`w-full h-full object-cover rounded-lg transition-all duration-200 ${
								selectedImages.has(image) ? 'opacity-75' : ''
							}`}
						/>
						
						{/* Selection Overlay */}
						<div
							className={`absolute inset-0 bg-black/40 transition-opacity duration-200 rounded-lg ${
								hoveredImage === image || selectedImages.has(image) ? 'opacity-100' : 'opacity-0'
							}`}
						>
							{/* Selection Checkbox */}
							<button
								onClick={() => toggleImageSelection(image)}
								className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
									selectedImages.has(image)
										? 'bg-blue-600 border-blue-600'
										: 'border-white bg-transparent'
								}`}
							>
								{selectedImages.has(image) && (
									<Check className="w-4 h-4 text-white" />
								)}
							</button>
							
							{/* Delete Button */}
							<Button
								variant="secondary"
								size="icon"
								className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white"
								onClick={() => onImageDelete(image)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)
}

export default ImageGrid