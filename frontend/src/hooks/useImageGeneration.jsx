import { useState } from 'react';
import  generateImages  from '../utils/batchImageGeneration';

export function useImageGeneration() {
	const [images, setImages] = useState([]);
	const [error, setError] = useState(null);
	const [progress, setProgress] = useState({
		isGenerating: false,
		currentBatch: 0,
		totalBatches: 0,
		completedImages: 0,
		totalImages: 0
	});
	
	const generate = async (prompt, numImages, magicPrompt) => {
		setError(null);
		setImages([]);
		setProgress({
			isGenerating: true,
			currentBatch: 0,
			totalBatches: Math.ceil(numImages / 8),
			completedImages: 0,
			totalImages: numImages
		});
		
		try {
			const result = await generateImages(prompt, numImages, magicPrompt, (progress) => {
				setProgress(prev => ({
					...prev,
					currentBatch: progress.currentBatch,
					completedImages: progress.completedImages
				}));
				setImages(progress.images);
			});
			
			setImages(result);
		} catch (err) {
			setError(err.message);
		} finally {
			setProgress(prev => ({
				...prev,
				isGenerating: false
			}));
		}
	};
	
	return {
		images,
		error,
		progress,
		generate
	};
}