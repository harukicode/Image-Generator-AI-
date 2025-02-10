import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment.js';
import { getDb } from './db/models/Database.js'
import { FileSystem } from './utils/fileSystem.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import imageRoutes from './routes/image.routes.js';
import generationRoutes from './routes/generation.routes.js';
import promptRoutes from './routes/prompt.routes.js';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
	origin: config.frontendUrl,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	optionsSuccessStatus: 200,
	credentials: true
}));

app.use(express.json());

const limiter = rateLimit({
	windowMs: config.rateLimit.windowMs,
	max: config.rateLimit.max,
	message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use('/uploads', express.static(config.paths.uploads));
app.use('/generated', express.static(config.paths.generated));

await FileSystem.initializeDirs();

app.use('/api', imageRoutes);
app.use('/api', generationRoutes);
app.use('/api/prompts', promptRoutes);

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'healthy' });
});

app.get('/api/debug/generated-images', async (req, res) => {
	try {
		const db = await getDb();
		const results = await db.all('SELECT * FROM generated_images');
		res.json(results);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = () => {
	try {
		app.listen(config.port, () => {
			console.log(`Server is running on port ${config.port}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

startServer();

export default app;