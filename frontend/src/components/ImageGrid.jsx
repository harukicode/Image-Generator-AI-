import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Download, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import DownloadDialog from "@/components/DownloadDialog"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

function ImageGrid({ images, onImageDelete }) {
	const [selectedImages, setSelectedImages] = useState(new Set())
	const [hoveredImage, setHoveredImage] = useState(null)
	const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const { toast } = useToast()
	
	const ITEMS_PER_PAGE = 12; // 3x4 сетка
	const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
	
	const getCurrentPageImages = () => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		const end = start + ITEMS_PER_PAGE;
		return images.slice(start, end);
	};
	
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
			
			for (const [index, url] of selectedImagesArray.entries()) {
				const response = await axios({
					url: `http://localhost:3000${url}`,
					method: 'GET',
					responseType: 'blob',
				})
				
				const fileNumber = (index + 1).toString().padStart(2, '0');
				const newFilename = `${companyName}-${fileNumber}.png`
				
				const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
				const link = document.createElement('a')
				link.href = downloadUrl
				link.setAttribute('download', newFilename)
				
				document.body.appendChild(link)
				link.click()
				
				document.body.removeChild(link)
				window.URL.revokeObjectURL(downloadUrl)
			}
			
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
			
			{/* Pagination and selection info */}
			<div className="text-sm text-gray-500 text-center space-y-1">
				<div>
					Showing {Math.min(ITEMS_PER_PAGE, images.length - (currentPage - 1) * ITEMS_PER_PAGE)} of {images.length} images
				</div>
			</div>
			{/*	{selectedImages.size > 0 && (*/}
			{/*		<div className="text-blue-600">*/}
			{/*			Selected {selectedImages.size} images across all pages*/}
			{/*		</div>*/}
			{/*	)}*/}
			{/*</div>*/}
			
			{/* Download Dialog */}
			<DownloadDialog
				isOpen={isDownloadDialogOpen}
				onClose={() => setIsDownloadDialogOpen(false)}
				onDownload={downloadSelectedImages}
			/>
			
			{/* Image Grid */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{getCurrentPageImages().map((image, index) => (
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
			
			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-4 mt-6">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
						disabled={currentPage === 1}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					
					<span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
					
					<Button
						variant="outline"
						size="icon"
						onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
						disabled={currentPage === totalPages}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	)
}

export default ImageGrid