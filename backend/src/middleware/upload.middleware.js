import multer from 'multer';
import { config } from '../config/environment.js';

const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
	if (!config.allowedFormats.includes(file.mimetype)) {
		cb(new Error('Invalid file format. Only JPEG, PNG and WEBP are allowed.'), false);
		return;
	}
	cb(null, true);
};


export const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: config.maxFileSize
	}
});


export const handleUploadErrors = (error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		if (error.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({
				success: false,
				error: `File too large. Maximum size is ${config.maxFileSize / (1024 * 1024)}MB`
			});
		}
		return res.status(400).json({
			success: false,
			error: error.message
		});
	}
	next(error);
};