// db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize database
async function initializeDb() {
	const db = await open({
		filename: 'images.db',
		driver: sqlite3.Database
	});
	
	// Create images table if it doesn't exist
	await db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      originalName TEXT,
      type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_generated BOOLEAN DEFAULT FALSE
    )
  `);
	
	return db;
}

// Add these functions to handle database operations
export async function saveImageToDb(filename, originalName, type, isGenerated = false) {
	const db = await initializeDb();
	
	try {
		const result = await db.run(
			'INSERT INTO images (filename, originalName, type, is_generated) VALUES (?, ?, ?, ?)',
			[filename, originalName, type, isGenerated]
		);
		return result.lastID;
	} catch (error) {
		console.error('Error saving image to database:', error);
		throw error;
	}
}

export async function getAllImages() {
	const db = await initializeDb();
	
	try {
		return await db.all('SELECT * FROM images ORDER BY created_at DESC');
	} catch (error) {
		console.error('Error fetching images from database:', error);
		throw error;
	}
}

export async function deleteImageFromDb(filename) {
	const db = await initializeDb();
	
	try {
		await db.run('DELETE FROM images WHERE filename = ?', filename);
	} catch (error) {
		console.error('Error deleting image from database:', error);
		throw error;
	}
}

// Function to save generated images
export async function saveGeneratedImages(imageUrls) {
	const db = await initializeDb();
	
	try {
		const timestamp = new Date().getTime();
		const savedImages = [];
		
		for (let [index, url] of imageUrls.entries()) {
			const filename = `generated-${timestamp}-${index}.jpg`;
			await db.run(
				'INSERT INTO images (filename, originalName, type, is_generated) VALUES (?, ?, ?, ?)',
				[filename, `Generated Image ${index + 1}`, 'image/jpeg', true]
			);
			savedImages.push(filename);
		}
		
		return savedImages;
	} catch (error) {
		console.error('Error saving generated images to database:', error);
		throw error;
	}
}