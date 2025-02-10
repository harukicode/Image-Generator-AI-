import { Router } from 'express';
import { ImageController } from '../controllers/image.controller.js';
import { upload, handleUploadErrors } from '../middleware/upload.middleware.js';
import { validateUploadRequest } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/upload',
	upload.single('image'),
	handleUploadErrors,
	validateUploadRequest,
	asyncHandler(ImageController.uploadImage)
);

router.get('/images',
	asyncHandler(ImageController.getUploadedImages)
);

router.get('/generated-images',
	asyncHandler(ImageController.getGeneratedImages)
);

router.delete('/images/:filename',
	asyncHandler(ImageController.deleteUploadedImage)
);

router.delete('/generated-images/:filename',
	asyncHandler(ImageController.deleteGeneratedImage)
);



export default router;