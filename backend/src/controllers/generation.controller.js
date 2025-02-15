import { claudeService } from '../services/claude.service.js'
import { openAIService } from '../services/openai.service.js';
import { ideogramService } from '../services/ideogram.service.js';
import { ResponseFormatter } from '../utils/asyncHandler.js';

export const GenerationController = {
	async generatePrompt(req, res) {
		try {
			const { customPrompt, contextSize, model = 'gpt' } = req.body;
			console.log('GeneratePrompt - Request received:', {
				customPrompt,
				contextSize,
				model,
				hasFile: !!req.file
			});
			
			if (!req.file) {
				return res.status(400).json({
					success: false,
					error: 'Image file is required'
				});
			}
			
			if (!['gpt', 'claude'].includes(model)) {
				return res.status(400).json({
					success: false,
					error: 'Invalid model specified. Must be either "gpt" or "claude"'
				});
			}
			
			if (!customPrompt) {
				return res.status(400).json({
					success: false,
					error: 'Custom prompt is required'
				});
			}
			
			// Выбираем сервис в зависимости от модели
			const service = model === 'claude' ? claudeService : openAIService;
			
			const imageBuffer = req.file.buffer;
			
			const result = await service.generatePrompt(
				imageBuffer,
				customPrompt,
				parseInt(contextSize) || undefined
			);
			
			console.log('GeneratePrompt - Success:', {
				model,
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
			const { context, userPrompt, model = 'gpt' } = req.body;
			console.log('RegeneratePrompt - Request received:', { model });
			
			if (!context) {
				return res.status(400).json(ResponseFormatter.error(
					'Context is required for regeneration'
				));
			}
			
			const service = model === 'claude' ? claudeService : openAIService;
			
			const result = await service.regeneratePrompt(
				context,
				userPrompt
			);
			
			console.log('RegeneratePrompt - Success:', { model });
			
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