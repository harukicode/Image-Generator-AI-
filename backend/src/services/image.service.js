import sharp from 'sharp';
import { FileSystem } from '../utils/fileSystem.js';
import { uploadedImagesRepository } from '../db/models/UploadedImagesRepository.js';
import { generatedImagesRepository } from '../db/models/GeneratedImagesRepository.js';
import { NotFoundError } from '../middleware/error.middleware.js';

class ImageService {

	async saveUploadedImage(buffer, originalName, mimeType) {
		try {
			const processedBuffer = await sharp(buffer)
				.resize(1024, 1024, {
					fit: 'inside',
					withoutEnlargement: true
				})
				.toFormat('jpeg', { quality: 90 })
				.toBuffer();
			
			const timestamp = Date.now();
			const filename = `${timestamp}-${originalName}`;
			
			await FileSystem.saveFile(processedBuffer, filename, 'uploaded');
			
			await uploadedImagesRepository.save(filename, originalName, mimeType);
			
			return {
				filename,
				url: `/uploads/${filename}`
			};
		} catch (error) {
			console.error('Error saving uploaded image:', error);
			throw new Error('Failed to save uploaded image');
		}
	}
	

	async getAllUploadedImages() {
		return await uploadedImagesRepository.getAll();
	}
	
	
	async getAllGeneratedImages() {
		const images = await generatedImagesRepository.getAll();
		console.log('Raw images from DB:', images);
		
		if (!Array.isArray(images) || images.length === 0) {
			console.log('No images found in the database');
		}
		
		return images;
	}
	

	async deleteUploadedImage(filename) {
		const image = await uploadedImagesRepository.getByFilename(filename);
		if (!image) {
			throw new NotFoundError('Uploaded image not found');
		}
		
		await FileSystem.deleteFile(filename, 'uploaded');
		await uploadedImagesRepository.delete(filename);
	}
	

	async deleteGeneratedImage(filename) {
		const image = await generatedImagesRepository.getByFilename(filename);
		if (!image) {
			throw new NotFoundError('Generated image not found');
		}
		
		await FileSystem.deleteFile(filename, 'generated');
		await generatedImagesRepository.delete(image.id);
	}
}

export const imageService = new ImageService();