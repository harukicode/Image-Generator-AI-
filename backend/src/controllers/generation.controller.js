import { openAIService } from '../services/openai.service.js';
import { ideogramService } from '../services/ideogram.service.js';
import { ResponseFormatter } from '../utils/asyncHandler.js';

export const GenerationController = {
	async generatePrompt(req, res) {
		try {
			const { customPrompt, contextSize } = req.body;
			console.log('GeneratePrompt - Request received:', {
				customPrompt,
				contextSize,
				hasFile: !!req.file
			});
			
			if (!req.file) {
				return res.status(400).json({
					success: false,
					error: 'Image file is required'
				});
			}
			
			if (!customPrompt) {
				return res.status(400).json({
					success: false,
					error: 'Custom prompt is required'
				});
			}
			
			const imageBuffer = req.file.buffer;
			
			const result = await openAIService.generatePrompt(
				imageBuffer,
				customPrompt,
				parseInt(contextSize) || undefined
			);
			
			console.log('GeneratePrompt - Success:', {
				promptLength: result.prompt.length,
				hasContext: !!result.context,
				contextSize: result.context.length
			});
			
			res.json({
				success: true,
				data: {
					prompt: result.prompt,
					context: result.context
				}
			});
		} catch (error) {
			console.error('GeneratePrompt - Error:', error);
			res.status(500).json({
				success: false,
				error: error.message || 'Failed to generate prompt'
			});
		}
	},
	
	async regeneratePrompt(req, res) {
		try {
			console.log('RegeneratePrompt - Request received');
			
			const { context, userPrompt } = req.body;
			
			if (!context) {
				return res.status(400).json(ResponseFormatter.error(
					'Context is required for regeneration'
				));
			}
			
			const result = await openAIService.regeneratePrompt(
				context,
				userPrompt
			);
			
			console.log('RegeneratePrompt - Success');
			
			res.json(ResponseFormatter.success({
				prompt: result.prompt,
				context: result.context
			}));
		} catch (error) {
			console.error('RegeneratePrompt - Error:', error);
			res.status(500).json(ResponseFormatter.error(
				'Failed to regenerate prompt: ' + error.message
			));
		}
	},
	
	async generateImages(req, res) {
		try {
			console.log('GenerateImages - Request received:', req.body);
			
			const { prompt, numImages = 4, magicPrompt = 'AUTO' } = req.body;
			
			if (!prompt) {
				return res.status(400).json(ResponseFormatter.error('Prompt is required'));
			}
			
			if (numImages > 8) {
				console.log('Splitting request into batches due to size:', numImages);
			}
			
			const imageUrls = await ideogramService.generateImages(
				prompt,
				numImages,
				magicPrompt
			);
			
			console.log('GenerateImages - Success:', {
				numberOfImages: imageUrls.length,
				urls: imageUrls
			});
			
			res.json(ResponseFormatter.success({
				imageUrls
			}));
		} catch (error) {
			console.error('GenerateImages - Error:', error);
			res.status(500).json(ResponseFormatter.error(
				'Failed to generate images: ' + error.message
			));
		}
	}
};