import { Router } from 'express';
import { GenerationController } from '../controllers/generation.controller.js';
import { upload, handleUploadErrors } from '../middleware/upload.middleware.js';
import {
	validateGenerationRequest,
	validatePromptRequest,
	validateRegenerationRequest
} from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/generate-prompt',
	upload.single('image'),
	handleUploadErrors,
	validatePromptRequest,
	asyncHandler(GenerationController.generatePrompt)
);

router.post('/regenerate-prompt',
	validateRegenerationRequest,
	asyncHandler(GenerationController.regeneratePrompt)
);

router.post('/generate-images',
	validateGenerationRequest,
	asyncHandler(GenerationController.generateImages)
);

export default router;