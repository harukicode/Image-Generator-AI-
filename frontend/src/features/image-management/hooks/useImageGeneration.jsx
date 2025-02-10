import { useState } from 'react';
import { createBatches, generateAllBatches } from '@/shared/utils/batchImageGeneration';
import axios from 'axios';

export const useImageGeneration = () => {
	const [generatedImages, setGeneratedImages] = useState([]);
	const [isGeneratingImages, setIsGeneratingImages] = useState(false);
	const [error, setError] = useState(null);
	const [numImages, setNumImages] = useState(4);
	const [magicPrompt, setMagicPrompt] = useState("AUTO");
	const [generationProgress, setGenerationProgress] = useState({
		totalBatches: 0,
		completedBatches: 0,
		isGenerating: false
	});
	
	const generateImages = async (currentPrompt) => {
		if (!currentPrompt || !numImages) {
			throw new Error("Please provide a prompt and number of images");
		}
		
		setIsGeneratingImages(true);
		setGeneratedImages([]);
		setError(null);
		
		try {
			console.log('Starting batch image generation:', { currentPrompt, numImages, magicPrompt });
			
			const batches = createBatches(parseInt(numImages));
			console.log('Created batches:', batches);
			
			setGenerationProgress({
				totalBatches: batches.length,
				completedBatches: 0,
				isGenerating: true
			});
			
			const images = await generateAllBatches({
				batches,
				prompt: currentPrompt,
				magicPrompt,
				onBatchComplete: ({ completedBatches, allImages }) => {
					console.log('Batch complete:', { completedBatches, imagesGenerated: allImages.length });
					setGenerationProgress(prev => ({
						...prev,
						completedBatches
					}));
					setGeneratedImages(allImages);
				},
				onError: (error) => {
					console.error('Batch error:', error);
					setError(error.message);
				}
			});
			
			setGeneratedImages(images);
		} catch (err) {
			console.error('Generation error:', err);
			setError(err.message);
			throw err;
		} finally {
			setIsGeneratingImages(false);
			setGenerationProgress(prev => ({
				...prev,
				isGenerating: false
			}));
		}
	};
	
	const deleteImage = async (imagePath) => {
		try {
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
		error,
		numImages,
		setNumImages,
		magicPrompt,
		setMagicPrompt,
		generationProgress,
		generateImages,
		deleteImage
	};
};