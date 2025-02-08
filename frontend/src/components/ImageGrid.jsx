import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DownloadDialog from "@/components/DownloadDialog"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

function ImageGrid({ images, onImageDelete }) {
	const [selectedImages, setSelectedImages] = useState(new Set())
	const [hoveredImage, setHoveredImage] = useState(null)
	const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false)
	const { toast } = useToast()
	
	const toggleImageSelection = (image) => {
		const newSelected = new Set(selectedImages)
		if (newSelected.has(image)) {
			newSelected.delete(image)
		} else {
			newSelected.add(image)
		}
		setSelectedImages(newSelected)
	}
	
	const downloadSelectedImages = async (companyName) => {
		try {
			const selectedImagesArray = Array.from(selectedImages)
			
			// Скачиваем каждое изображение
			for (const url of selectedImagesArray) {
				// Получаем файл как blob
				const response = await axios({
					url: `http://localhost:3000${url}`,
					method: 'GET',
					responseType: 'blob',
				})
				
				// Получаем индекс из имени файла
				const fullFilename = url.split('/').pop()
				const fileIndex = fullFilename.split('-').pop()
				
				// Создаем новое имя файла
				const newFilename = `${companyName}-${fileIndex}`
				
				// Создаем URL для скачивания
				const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
				
				// Создаем ссылку для скачивания
				const link = document.createElement('a')
				link.href = downloadUrl
				link.setAttribute('download', newFilename)
				
				// Запускаем скачивание
				document.body.appendChild(link)
				link.click()
				
				// Очищаем
				document.body.removeChild(link)
				window.URL.revokeObjectURL(downloadUrl)
			}
			
			// Очищаем выбранные изображения
			setSelectedImages(new Set())
			setIsDownloadDialogOpen(false)
			
			toast({
				title: "Success",
				description: "Images downloaded successfully",
			})
			
		} catch (error) {
			console.error('Download error:', error)
			toast({
				title: "Error",
				description: "Failed to download images",
				variant: "destructive",
			})
		}
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
						onClick={() => setIsDownloadDialogOpen(true)}
						className="bg-blue-600 hover:bg-blue-700 text-white"
					>
						<Download className="h-4 w-4 mr-2" />
						Download Selected ({selectedImages.size})
					</Button>
				)}
			</div>
			
			{/* Download Dialog */}
			<DownloadDialog
				isOpen={isDownloadDialogOpen}
				onClose={() => setIsDownloadDialogOpen(false)}
				onDownload={downloadSelectedImages}
			/>
			
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