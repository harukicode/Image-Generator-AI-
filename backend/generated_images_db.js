// generated_images_db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

async function initializeDb() {
	if (db) return db;
	
	db = await open({
		filename: 'generated_images.db',
		driver: sqlite3.Database
	});
	
	await db.exec(`
      CREATE TABLE IF NOT EXISTS generated_images (
                                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                      filename TEXT NOT NULL,
                                                      prompt TEXT,
                                                      original_image TEXT,
                                                      company_name TEXT,
                                                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
	`);
	
	return db;
}

export async function saveGeneratedImage(filename, prompt, originalImage, companyName) {
	const db = await initializeDb();
	
	try {
		const result = await db.run(
			'INSERT INTO generated_images (filename, prompt, original_image, company_name) VALUES (?, ?, ?, ?)',
			[filename, prompt, originalImage, companyName]
		);
		return result.lastID;
	} catch (error) {
		console.error('Error saving generated image:', error);
		throw error;
	}
}

export async function getGeneratedImages() {
	const db = await initializeDb();
	
	try {
		return await db.all('SELECT * FROM generated_images ORDER BY created_at DESC');
	} catch (error) {
		console.error('Error fetching generated images:', error);
		throw error;
	}
}

export async function getGeneratedImageByFilename(filename) {
	const db = await initializeDb();
	try {
		return await db.get('SELECT * FROM generated_images WHERE filename = ?', filename);
	} catch (error) {
		console.error('Error fetching generated image:', error);
		throw error;
	}
}

export async function deleteGeneratedImage(id) {
	const db = await initializeDb();
	
	try {
		await db.run('DELETE FROM generated_images WHERE id = ?', id);
	} catch (error) {
		console.error('Error deleting generated image:', error);
		throw error;
	}
}

export { initializeDb };