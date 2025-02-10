import axios from 'axios';

export function createBatches(totalImages) {
	const MAX_BATCH_SIZE = 8;
	const batches = [];
	
	const fullBatches = Math.floor(totalImages / MAX_BATCH_SIZE);
	const remainder = totalImages % MAX_BATCH_SIZE;
	
	for (let i = 0; i < fullBatches; i++) {
		batches.push(MAX_BATCH_SIZE);
	}
	
	if (remainder > 0) {
		batches.push(remainder);
	}
	
	console.log('Created batches:', { totalImages, batches });
	return batches;
}

export async function generateAllBatches({
	                                         batches,
	                                         prompt,
	                                         magicPrompt,
	                                         onBatchComplete,
	                                         onError
                                         }) {
	const allGeneratedImages = [];
	let completedBatches = 0;
	
	for (const batchSize of batches) {
		try {
			console.log('Processing batch:', { batchSize, completedBatches: completedBatches + 1, totalBatches: batches.length });
			
			const response = await axios.post(
				"http://localhost:3000/api/generate-images",
				{
					prompt,
					numImages: batchSize,
					magicPrompt
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					}
				}
			);
			
			if (response.data && response.data.success) {
				const newImages = response.data.data.imageUrls || [];
				allGeneratedImages.push(...newImages);
				
				completedBatches++;
				
				if (onBatchComplete) {
					onBatchComplete({
						completedBatches,
						totalBatches: batches.length,
						newImages: newImages,
						allImages: allGeneratedImages
					});
				}
			} else {
				throw new Error(response.data?.error || "Generation failed");
			}
		} catch (error) {
			console.error("Batch generation error:", error);
			if (onError) {
				onError(error, completedBatches);
			} else {
				throw error;
			}
		}
	}
	
	return allGeneratedImages;
}