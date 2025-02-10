import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/environment.js';


export const FileSystem = {

	async initializeDirs() {
		try {
			await fs.mkdir(config.paths.uploads, { recursive: true });
			await fs.mkdir(config.paths.generated, { recursive: true });
			console.log('Directories initialized successfully');
		} catch (error) {
			console.error('Error creating directories:', error);
			throw new Error('Failed to initialize directories');
		}
	},
	

	async saveFile(buffer, filename, type = 'uploaded') {
		const dir = type === 'uploaded' ? config.paths.uploads : config.paths.generated;
		const filePath = path.join(dir, filename);
		
		try {
			await fs.writeFile(filePath, buffer);
			return filePath;
		} catch (error) {
			console.error(`Error saving ${type} file:`, error);
			throw new Error(`Failed to save ${type} file`);
		}
	},
	

	async deleteFile(filename, type = 'uploaded') {
		const dir = type === 'uploaded' ? config.paths.uploads : config.paths.generated;
		const filePath = path.join(dir, filename);
		
		try {
			await fs.unlink(filePath);
		} catch (error) {
			if (error.code !== 'ENOENT') { // Ignore if file doesn't exist
				console.error(`Error deleting ${type} file:`, error);
				throw new Error(`Failed to delete ${type} file`);
			}
		}
	},
	

	async fileExists(filename, type = 'uploaded') {
		const dir = type === 'uploaded' ? config.paths.uploads : config.paths.generated;
		const filePath = path.join(dir, filename);
		
		try {
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}
};