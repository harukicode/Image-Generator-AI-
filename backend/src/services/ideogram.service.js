import axios from 'axios'
import { config } from '../config/environment.js'
import { generatedImagesRepository } from '../db/models/GeneratedImagesRepository.js'
import { FileSystem } from '../utils/fileSystem.js'

class IdeogramService {
	constructor() {
		this.headers = {
			'Api-Key': config.ideogramApiKey,
			'Content-Type': 'application/json'
		};
		this.MAX_IMAGES_PER_REQUEST = 8;
	}
	
	async generateImages(prompt, numImages = 4, magicPrompt = 'AUTO') {
		try {
			const batchSize = Math.min(numImages, this.MAX_IMAGES_PER_REQUEST);
			
			console.log('Starting image generation with params:', {
				prompt,
				requestedImages: numImages,
				actualBatchSize: batchSize,
				magicPrompt
			});
			
			const imageRequest = {
				image_request: {
					prompt: prompt,
					model: 'V_2_TURBO',
					magic_prompt_option: magicPrompt,
					num_images: batchSize,
					aspect_ratio: 'ASPECT_1_1'
				}
			};
			
			const response = await axios.post(
				'https://api.ideogram.ai/generate',
				imageRequest,
				{
					headers: this.headers,
					timeout: 60000
				}
			);
			
			console.log('Received response from Ideogram:', {
				status: response.status,
				hasData: !!response.data?.data,
				dataLength: response.data?.data?.length
			});
			
			if (!response.data?.data?.[0]?.url) {
				throw new Error('Invalid response from Ideogram API: No image URLs in response');
			}

			return await this.processGeneratedImages(
				response.data.data,
				prompt
			);
			
		} catch (error) {
			console.error('Ideogram API Error:', {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status
			});
			throw new Error(`Failed to generate images: ${error.message}`);
		}
	}
	
	async processGeneratedImages(imageDataArray, prompt) {
		const savedImages = [];
		const timestamp = Date.now();
		
		for (let [index, imageData] of imageDataArray.entries()) {
			try {
				const imageResponse = await axios.get(imageData.url, {
					responseType: 'arraybuffer',
					timeout: 30000
				});
				
				const fileNumber = (index + 1).toString().padStart(2, '0');
				const filename = `generated-${timestamp}-${fileNumber}.png`;
				
				await FileSystem.saveFile(
					Buffer.from(imageResponse.data),
					filename,
					'generated'
				);
				
				await generatedImagesRepository.save(
					filename,
					prompt,
					'custom'
				);
				
				savedImages.push(`/generated/${filename}`);
				console.log(`Successfully processed image ${index + 1}:`, `/generated/${filename}`);
			} catch (error) {
				console.error(`Error processing image ${index}:`, error);
			}
		}
		
		if (savedImages.length === 0) {
			throw new Error('Failed to save any generated images');
		}
		
		return savedImages;
	}
}

export const ideogramService = new IdeogramService();