import { ValidationError } from './error.middleware.js';

export const validatePromptRequest = (req, res, next) => {
	console.log('ValidatePromptRequest - Body:', req.body);
	console.log('ValidatePromptRequest - File:', req.file);
	
	const { customPrompt, model } = req.body;
	
	if (!customPrompt) {
		console.log('ValidatePromptRequest - Error: Missing customPrompt');
		throw new ValidationError('Custom prompt is required');
	}
	
	if (model && !['gpt', 'claude'].includes(model)) {
		throw new ValidationError('Invalid model specified');
	}
	
	if (!req.file) {
		console.log('ValidatePromptRequest - Error: Missing file');
		throw new ValidationError('Image file is required');
	}
	
	next();
};

export const validateGenerationRequest = (req, res, next) => {
	console.log('ValidateGenerationRequest - Body:', req.body);
	
	const { prompt, numImages, magicPrompt } = req.body;
	
	if (!prompt) {
		throw new ValidationError('Prompt is required');
	}
	
	if (numImages && (isNaN(numImages) || numImages < 1 || numImages > 50)) {
		throw new ValidationError('Number of images must be between 1 and 50');
	}
	
	if (magicPrompt && !['ON', 'OFF', 'AUTO'].includes(magicPrompt)) {
		throw new ValidationError('Invalid magic prompt option');
	}
	
	next();
};

export const validateUploadRequest = (req, res, next) => {
	if (!req.file) {
		throw new ValidationError('No image file provided');
	}
	next();
}

export const validateRegenerationRequest = (req, res, next) => {
	console.log('ValidateRegenerationRequest - Body:', req.body);
	
	const { context } = req.body;
	
	if (!context) {
		throw new ValidationError('Context is required for regeneration');
	}
	
	next();
};