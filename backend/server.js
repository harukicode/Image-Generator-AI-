import axios from "axios"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import rateLimit from "express-rate-limit"
import multer from "multer"
import OpenAI from "openai"
import { dirname } from "path"
import sharp from "sharp"
import { fileURLToPath } from "url"
import fs from "fs/promises"
import path from "path"

import {
	saveGeneratedImage,
	getGeneratedImages,
	deleteGeneratedImage,
	getGeneratedImageByFilename,
} from './generated_images_db.js';

import {
	saveImageToDb,
	getAllImages,
	deleteImageFromDb,
} from './db.js';

// Environment configuration
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Initialize Express
const app = express()
const port = process.env.PORT || 3000

// Setup CORS with options
const corsOptions = {
	origin: process.env.FRONTEND_URL || "http://localhost:5178",
	optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())

// Rate limiting setup
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

// File upload configuration
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const storage = multer.memoryStorage()
const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (!ALLOWED_FORMATS.includes(file.mimetype)) {
			cb(new Error("Invalid file format. Only JPEG, PNG and WEBP are allowed."), false)
			return
		}
		cb(null, true)
	},
	limits: {
		fileSize: MAX_FILE_SIZE,
	},
})

// Initialize OpenAI
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})


// Ideogram API setup
const IDEOGRAM_API_KEY = process.env.IDEOGRAM_API_KEY

// Input validation middleware
const validateInput = (req, res, next) => {
	const { newName } = req.body
	
	if (!newName || typeof newName !== "string" || newName.trim().length === 0) {
		return res.status(400).json({
			success: false,
			error: "Invalid new company name",
		})
	}
	
	if (!req.file) {
		return res.status(400).json({
			success: false,
			error: "No image file provided",
		})
	}
	
	next()
}

// Image processing middleware
const processImage = async (req, res, next) => {
	try {
		if (!req.file) return next()
		
		// Process image with sharp
		const processedBuffer = await sharp(req.file.buffer)
			.resize(1024, 1024, {
				fit: "inside",
				withoutEnlargement: true,
			})
			.toFormat("jpeg", { quality: 90 })
			.toBuffer()
		
		req.processedImage = processedBuffer
		next()
	} catch (error) {
		next(new Error("Error processing image: " + error.message))
	}
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
	console.error("Error:", err)
	
	if (err instanceof multer.MulterError) {
		if (err.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				success: false,
				error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
			})
		}
	}
	
	return res.status(500).json({
		success: false,
		error: err.message || "Internal server error",
	})
}


// Определяем пути к директориям
const UPLOAD_DIR = path.join(__dirname, "uploads"); // Для загруженных изображений
const GENERATED_DIR = path.join(__dirname, "generated"); // Для сгенерированных изображений

// Настраиваем статические пути для обеих директорий
app.use("/uploads", express.static(UPLOAD_DIR));

// Создаем обе директории при запуске сервера
async function initializeDirs() {
	try {
		await fs.mkdir(UPLOAD_DIR, { recursive: true });
		await fs.mkdir(GENERATED_DIR, { recursive: true });
		console.log('Directories initialized successfully');
	} catch (error) {
		console.error('Error creating directories:', error);
	}
}

// Вызываем функцию инициализации
await initializeDirs();


// Helper function to analyze image with GPT-4 Vision
async function analyzeImageWithGPT(imageBuffer, newName) {
	try {
		const base64Image = imageBuffer.toString("base64")
		
		const response = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					content:
						"You are an image prompt generator. When analyzing an image, create a SINGLE sentence prompt that describes the key visual elements for recreating a similar style image. Focus only on the visual composition, colors, and layout. Format should be exactly like this example: 'Minimalistic Nike advertisement with a clean, neutral background. The Nike logo is prominently displayed at the top. A single, stylized sneaker is centered, floating above a subtle shadow in a modern flat design. Below, bold text reads: \"CLICK THE SHOE AND SEE YOUR DISCOUNT!\". The design is sleek and visually striking.'",
				},
				{
					role: "user",
					content: [
						{
							type: "text",
							text: `Generate a prompt for ${newName} following EXACTLY the same format as the example in the system message. Start with "Minimalistic ${newName} advertisement" and maintain the same descriptive style. Make sure to describe the layout, include text placement, and maintain the same level of detail. The image should be 1:1 square format.`,
						},
						{
							type: "image_url",
							image_url: {
								url: `data:image/jpeg;base64,${base64Image}`,
							},
						},
					],
				},
			],
			max_tokens: 1500,
		})
		
		return response.choices[0].message.content
	} catch (error) {
		console.error("Error analyzing image with GPT:", error)
		throw new Error("Failed to analyze image with GPT: " + error.message)
	}
}

// Helper function for Ideogram API
async function generateImageWithIdeogram(imageBuffer, prompt, numImages = 4, magicPrompt = "AUTO") {
	try {
		const imageRequest = {
			prompt: prompt,
			model: "V_2_TURBO",
			magic_prompt_option: magicPrompt,
			num_images: numImages,
			aspect_ratio: "ASPECT_1_1",
		}
		
		console.log("Sending request to Ideogram:", imageRequest)
		
		const response = await axios.post(
			"https://api.ideogram.ai/generate",
			{
				image_request: imageRequest,
			},
			{
				headers: {
					"Api-Key": IDEOGRAM_API_KEY,
					"Content-Type": "application/json",
				},
				timeout: 30000,
			},
		)
		
		console.log("Received response from Ideogram:", response.data)
		
		if (!response.data?.data?.[0]?.url) {
			throw new Error("Invalid response from Ideogram API")
		}
		
		return response.data
	} catch (error) {
		console.error("Error generating image with Ideogram:", error)
		throw new Error(`Failed to generate image with Ideogram: ${error.response?.data?.detail || error.message}`)
	}
}



// Helper function to get all images in the upload directory
async function getUploadedImages() {
	const files = await fs.readdir(UPLOAD_DIR)
	return files.filter((file) => ALLOWED_FORMATS.includes(path.extname(file).toLowerCase()))
}

app.get("/api/images", async (req, res) => {
	try {
		const images = await getAllImages();
		res.json({
			success: true,
			images: images.map(img => ({
				id: img.id,
				filename: img.filename,
				url: `/uploads/${img.filename}`,
				originalName: img.originalName,
				created_at: img.created_at,
				is_generated: img.is_generated
			}))
		});
	} catch (error) {
		res.status(500).json({ success: false, error: "Failed to retrieve images" });
	}
});

app.post("/api/generate-prompt", upload.single("image"), async (req, res) => {
	try {
		const { newName } = req.body;
		const imageBuffer = req.file.buffer;
		
		const base64Image = imageBuffer.toString("base64");
		
		// Создаем начальный контекст чата
		const messages = [
			{
				role: "system",
				content: "You are an image prompt generator. When analyzing an image, create a SINGLE sentence prompt that describes the key visual elements for recreating a similar style image. Focus only on the visual composition, colors, and layout."
			},
			{
				role: "user",
				content: [
					{
						type: "text",
						text: `Generate a prompt for ${newName} following EXACTLY the same format as the example in the system message. Start with "Minimalistic ${newName} advertisement" and maintain the same descriptive style. Make sure to describe the layout, include text placement, and maintain the same level of detail. The image should be 1:1 square format.`
					},
					{
						type: "image_url",
						image_url: {
							url: `data:image/jpeg;base64,${base64Image}`
						}
					}
				]
			}
		];
		
		const response = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: messages,
			max_tokens: 1500,
		});
		
		res.json({
			success: true,
			prompt: response.choices[0].message.content,
			context: messages.concat(response.choices[0].message)
		});
	} catch (error) {
		console.error("Error generating prompt:", error);
		res.status(500).json({
			success: false,
			error: "Failed to generate prompt",
			details: error.message
		});
	}
});


app.post("/api/regenerate-prompt", async (req, res) => {
	try {
		const { context, userPrompt } = req.body;
		
		if (!context) {
			throw new Error("No context provided");
		}
		
		// Добавляем пользовательский ввод в контекст, если он есть
		const messages = [...context];
		if (userPrompt) {
			messages.push({
				role: "user",
				content: userPrompt
			});
		}
		
		const response = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: messages,
			max_tokens: 1500,
		});
		
		res.json({
			success: true,
			prompt: response.choices[0].message.content,
			context: messages.concat(response.choices[0].message)
		});
	} catch (error) {
		console.error("Error regenerating prompt:", error);
		res.status(500).json({
			success: false,
			error: "Failed to regenerate prompt",
			details: error.message
		});
	}
});


app.post("/api/generate-images", async (req, res) => {
	try {
		const { prompt, companyName, numImages = 4, magicPrompt = "AUTO" } = req.body;  // Изменить эту строку
		
		// Отправляем запрос в Ideogram
		const ideogramResponse = await generateImageWithIdeogram(null, prompt, numImages, magicPrompt);  // Изменить эту строку
		console.log("Received images from Ideogram:", ideogramResponse.data.length);
		
		const savedImages = [];
		const timestamp = Date.now(); // Общий timestamp для всех изображений в одной генерации
		
		// Сохраняем каждое изображение
		for (let [index, imageData] of ideogramResponse.data.entries()) {
			try {
				console.log(`Processing image ${index + 1}/${ideogramResponse.data.length}`);
				
				// Загружаем изображение
				const imageResponse = await axios.get(imageData.url, {
					responseType: 'arraybuffer',
					timeout: 30000
				});
				
				// Генерируем имя файла с правильной нумерацией
				const fileNumber = (index + 1).toString().padStart(2, '0');
				const filename = `${companyName}-${timestamp}-${fileNumber}.png`;
				const filePath = path.join(GENERATED_DIR, filename);
				
				// Сохраняем файл
				await fs.writeFile(filePath, imageResponse.data);
				console.log(`Saved image to ${filePath}`);
				
				// Сохраняем информацию в БД
				await saveGeneratedImage(
					filename,
					prompt,
					null,
					companyName
				);
				
				savedImages.push({
					url: `/generated/${filename}`,
					filename: filename
				});
			} catch (error) {
				console.error(`Error saving image ${index}:`, error);
			}
		}
		
		if (savedImages.length === 0) {
			throw new Error("Failed to save any images");
		}
		
		res.json({
			success: true,
			imageUrls: savedImages.map(img => img.url)
		});
		
	} catch (error) {
		console.error("Error in /api/generate-images:", error);
		res.status(500).json({
			success: false,
			error: "Failed to generate images",
			details: error.message
		});
	}
});

app.get("/api/generated-images", async (req, res) => {
	try {
		const images = await getGeneratedImages();
		res.json({
			success: true,
			images: images.map(img => ({
				id: img.id,
				filename: img.filename,
				url: `/generated/${img.filename}`,
				prompt: img.prompt,
				company_name: img.company_name,
				created_at: img.created_at
			}))
		});
	} catch (error) {
		console.error("Error fetching generated images:", error);
		res.status(500).json({
			success: false,
			error: "Failed to fetch generated images"
		});
	}
});

app.delete("/api/generated-images/:filename", async (req, res) => {
	try {
		const image = await getGeneratedImageByFilename(req.params.filename);
		
		if (image) {
			const filePath = path.join(GENERATED_DIR, image.filename);
			try {
				await fs.unlink(filePath);
			} catch (error) {
				console.error("File not found:", filePath);
			}
			
			await deleteGeneratedImage(image.id);
			res.json({ success: true });
		} else {
			res.status(404).json({
				success: false,
				error: "Image not found"
			});
		}
	} catch (error) {
		console.error("Error deleting generated image:", error);
		res.status(500).json({
			success: false,
			error: "Failed to delete generated image",
			details: error.message
		});
	}
});

// Update the /api/upload endpoint
app.post("/api/upload", upload.single("image"), async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ success: false, error: "No image file provided" });
	}
	
	const fileName = `${Date.now()}-${req.file.originalname}`;
	const filePath = path.join(UPLOAD_DIR, fileName);
	
	try {
		await fs.writeFile(filePath, req.file.buffer);
		
		// Save to database
		await saveImageToDb(
			fileName,
			req.file.originalname,
			req.file.mimetype,
			false
		);
		
		res.json({ success: true, imageUrl: `/uploads/${fileName}` });
	} catch (error) {
		res.status(500).json({ success: false, error: "Failed to save image" });
	}
});

// Update the delete endpoint
app.delete("/api/generated-images/:filename", async (req, res) => {
	try {
		console.log('Attempting to delete image with filename:', req.params.filename);
		const image = await getGeneratedImageByFilename(req.params.filename);
		
		if (image) {
			console.log('Found image in database:', image);
			const filePath = path.join(GENERATED_DIR, image.filename);
			try {
				await fs.unlink(filePath);
				console.log('Successfully deleted file:', filePath);
			} catch (error) {
				console.error("File not found:", filePath);
			}
			
			await deleteGeneratedImage(image.id);
			console.log('Successfully deleted database record');
			res.json({ success: true });
		} else {
			console.log('Image not found in database');
			res.status(404).json({
				success: false,
				error: "Image not found"
			});
		}
	} catch (error) {
		console.error("Error deleting generated image:", error);
		res.status(500).json({
			success: false,
			error: "Failed to delete generated image",
			details: error.message
		});
	}
});

// Update the delete endpoint
app.delete("/api/images/:filename", async (req, res) => {
	const filePath = path.join(UPLOAD_DIR, req.params.filename);
	try {
		// Проверяем существование файла перед удалением
		try {
			await fs.access(filePath);
		} catch (error) {
			console.log('File does not exist:', filePath);
			// Если файл не существует, просто удаляем запись из БД
			await deleteImageFromDb(req.params.filename);
			return res.json({ success: true });
		}
		
		// Удаляем файл и запись из БД
		await fs.unlink(filePath);
		await deleteImageFromDb(req.params.filename);
		res.json({ success: true });
	} catch (error) {
		console.error("Error deleting image:", error);
		res.status(500).json({
			success: false,
			error: "Failed to delete image",
			details: error.message
		});
	}
});

// Serve uploaded files
app.use("/uploads", express.static(UPLOAD_DIR))

// Add error handling middleware at the end
app.use(errorHandler)

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({ status: "healthy" })
})

app.get("/generated/:filename", (req, res) => {
	const filename = req.params.filename;
	const filePath = path.join(GENERATED_DIR, filename);
	
	res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
	res.sendFile(filePath);
});

// Start server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

