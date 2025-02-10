import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '../../');

dotenv.config({ path: path.join(PROJECT_ROOT, '.env') });

const requiredEnvVars = ['OPENAI_API_KEY', 'IDEOGRAM_API_KEY'];
for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(`Missing required environment variable: ${envVar}`);
	}
}

export const config = {
	port: process.env.PORT || 3000,
	nodeEnv: process.env.NODE_ENV || 'development',
	
	openaiApiKey: process.env.OPENAI_API_KEY,
	ideogramApiKey: process.env.IDEOGRAM_API_KEY,
	
	frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
	
	maxFileSize: 10 * 1024 * 1024, // 10MB
	allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
	
	paths: {
		uploads: path.join(PROJECT_ROOT, 'uploads'),
		generated: path.join(PROJECT_ROOT, 'generated'),
	},
	
	rateLimit: {
		windowMs: 15 * 60 * 1000,
		max: 200
	}
};