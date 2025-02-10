import fs from 'fs/promises'
import path from 'path'
import { generatedImagesRepository } from '../db/models/GeneratedImagesRepository.js'
import { imageService } from '../services/image.service.js';
import { ResponseFormatter } from '../utils/asyncHandler.js';

export const ImageController = {

	async uploadImage(req, res) {
		const { file } = req;
		const result = await imageService.saveUploadedImage(
			file.buffer,
			file.originalname,
			file.mimetype
		);
		
		res.json(ResponseFormatter.success({
			imageUrl: result.url
		}));
	},
	

	async getUploadedImages(req, res) {
		const images = await imageService.getAllUploadedImages();
		res.json(ResponseFormatter.success({
			images: images.map(img => ({
				id: img.id,
				filename: img.filename,
				url: `/uploads/${img.filename}`,
				originalName: img.original_name,
				created_at: img.created_at
			}))
		}));
	},
	
	
	async getGeneratedImages(req, res) {
		try {
			const images = await imageService.getAllGeneratedImages();
			console.log('Images from DB:', images);
			
			const validImages = [];
			for (const image of images) {
				const filePath = path.join(process.cwd(), 'generated', image.filename);
				console.log(`Checking file: ${filePath}`);
				try {
					await fs.access(filePath);
					const stats = await fs.stat(filePath);
					console.log(`File exists: ${filePath}, Size: ${stats.size} bytes`);
					validImages.push(image);
				} catch (error) {
					console.error(`Error accessing file: ${filePath}`, error);
					if (error.code === 'ENOENT') {
						console.log(`File not found: ${filePath}`);
						await generatedImagesRepository.delete(image.id);
						console.log(`Removed missing image from DB: ${image.filename}`);
					} else {
						console.error(`Unexpected error for file: ${filePath}`, error);
					}
				}
			}
			
			console.log('Valid images:', validImages);
			
			res.json(ResponseFormatter.success({
				images: validImages.map(img => ({
					id: img.id,
					filename: img.filename,
					url: `/generated/${img.filename}`,
					prompt: img.prompt,
					company_name: img.company_name,
					created_at: img.created_at
				}))
			}));
		} catch (error) {
			console.error("Error fetching generated images:", error);
			res.status(500).json({
				success: false,
				error: "Failed to fetch generated images"
			});
		}
	},

	async deleteUploadedImage(req, res) {
		await imageService.deleteUploadedImage(req.params.filename);
		res.json(ResponseFormatter.success({ message: 'Image deleted successfully' }));
	},
	

	async deleteGeneratedImage(req, res) {
		await imageService.deleteGeneratedImage(req.params.filename);
		res.json(ResponseFormatter.success({ message: 'Image deleted successfully' }));
	}
};