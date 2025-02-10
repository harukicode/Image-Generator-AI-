import { Router } from 'express';
import { PromptController } from '../controllers/prompt.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/presets',
	asyncHandler(PromptController.getAllPresets)
);

router.post('/presets',
	asyncHandler(PromptController.createPreset)
);

router.put('/presets/:id',
	asyncHandler(PromptController.updatePreset)
);

router.delete('/presets/:id',
	asyncHandler(PromptController.deletePreset)
);

// Prompt Additions routes
router.get('/additions',
	asyncHandler(PromptController.getAllAdditions)
);

router.post('/additions',
	asyncHandler(PromptController.createAddition)
);

router.put('/additions/:id',
	asyncHandler(PromptController.updateAddition)
);

router.delete('/additions/:id',
	asyncHandler(PromptController.deleteAddition)
);

export default router;