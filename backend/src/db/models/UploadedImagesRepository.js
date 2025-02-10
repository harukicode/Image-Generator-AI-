import { getDb } from './Database.js';

class UploadedImagesRepository {

	async save(filename, originalName, mimeType) {
		const db = await getDb();
		try {
			const result = await db.run(
				'INSERT INTO uploaded_images (filename, original_name, mime_type) VALUES (?, ?, ?)',
				[filename, originalName, mimeType]
			);
			return result.lastID;
		} catch (error) {
			console.error('Error saving uploaded image:', error);
			throw new Error('Failed to save uploaded image to database');
		}
	}
	

	async getAll() {
		const db = await getDb();
		try {
			return await db.all('SELECT * FROM uploaded_images ORDER BY created_at DESC');
		} catch (error) {
			console.error('Error fetching uploaded images:', error);
			throw new Error('Failed to fetch uploaded images from database');
		}
	}
	

	
	async getByFilename(filename) {
		const db = await getDb();
		try {
			return await db.get('SELECT * FROM uploaded_images WHERE filename = ?', filename);
		} catch (error) {
			console.error('Error fetching uploaded image:', error);
			throw new Error('Failed to fetch uploaded image from database');
		}
	}
	

	
	async delete(filename) {
		const db = await getDb();
		try {
			await db.run('DELETE FROM uploaded_images WHERE filename = ?', filename);
		} catch (error) {
			console.error('Error deleting uploaded image:', error);
			throw new Error('Failed to delete uploaded image from database');
		}
	}
}

export const uploadedImagesRepository = new UploadedImagesRepository();