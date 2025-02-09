import { useState } from 'react'
import { createBatches, generateAllBatches } from '@/shared/utils/batchImageGeneration'
import axios from 'axios'

export const useImageGeneration = () => {
	const [generatedImages, setGeneratedImages] = useState([])
	const [isGeneratingImages, setIsGeneratingImages] = useState(false)
	const [numImages, setNumImages] = useState(4)
	const [magicPrompt, setMagicPrompt] = useState("AUTO")
	const [generationProgress, setGenerationProgress] = useState({
		totalBatches: 0,
		completedBatches: 0,
		isGenerating: false
	})
	
	const generateImages = async (currentPrompt) => {
		if (!currentPrompt || !numImages) {
			throw new Error("Please provide a prompt and number of images")
		}
		
		setIsGeneratingImages(true)
		setGeneratedImages([])
		
		try {
			const batches = createBatches(parseInt(numImages))
			setGenerationProgress({
				totalBatches: batches.length,
				completedBatches: 0,
				isGenerating: true
			})
			
			await generateAllBatches({
				batches,
				prompt: currentPrompt,
				magicPrompt,
				onBatchComplete: ({ completedBatches, allImages }) => {
					setGenerationProgress(prev => ({
						...prev,
						completedBatches
					}))
					setGeneratedImages(allImages)
				}
			})
		} finally {
			setIsGeneratingImages(false)
			setGenerationProgress(prev => ({
				...prev,
				isGenerating: false
			}))
		}
	}
	
	const deleteImage = async (imagePath) => {
		try {
			// Изображения приходят в формате /generated/filename.png
			const filename = imagePath.split('/generated/').pop();
			await axios.delete(`http://localhost:3000/api/generated-images/${filename}`);
			setGeneratedImages(prev => prev.filter(img => img !== imagePath));
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	};
	
	return {
		generatedImages,
		isGeneratingImages,
		numImages,
		setNumImages,
		magicPrompt,
		setMagicPrompt,
		generationProgress,
		generateImages,
		deleteImage
	}
}