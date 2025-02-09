import axios from 'axios';

// Функция для разбиения на батчи
export function createBatches(totalImages) {
	const batchSize = 8;
	const batches = [];
	
	const fullBatches = Math.floor(totalImages / batchSize);
	const remainder = totalImages % batchSize;
	
	// Добавляем полные батчи
	for (let i = 0; i < fullBatches; i++) {
		batches.push(batchSize);
	}
	
	// Добавляем оставшиеся изображения, если есть
	if (remainder > 0) {
		batches.push(remainder);
	}
	
	return batches;
}

// Функция для генерации всех батчей
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
			// Отправляем запрос на генерацию текущего батча
			const response = await axios.post("http://localhost:3000/api/generate-images", {
				prompt,
				numImages: batchSize,
				magicPrompt
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			});
			
			if (response.data && response.data.success) {
				// Добавляем новые URL к общему списку
				const newImages = response.data.imageUrls || [];
				allGeneratedImages.push(...newImages);
				
				completedBatches++;
				
				// Вызываем callback с информацией о прогрессе
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