import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
	try {
		const oldImagesDb = await open({
			filename: path.join(__dirname, '../../images.db'),
			driver: sqlite3.Database
		});
		
		const oldGeneratedDb = await open({
			filename: path.join(__dirname, '../../generated_images.db'),
			driver: sqlite3.Database
		});
		
		const newDb = await open({
			filename: path.join(__dirname, '../../database.sqlite'),
			driver: sqlite3.Database
		});
		
		await newDb.exec(`
            CREATE TABLE IF NOT EXISTS uploaded_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL UNIQUE,
                original_name TEXT,
                mime_type TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS generated_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL UNIQUE,
                prompt TEXT,
                company_name TEXT,
                original_image_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (original_image_id) REFERENCES uploaded_images(id)
                    ON DELETE SET NULL
            );
        `);
		
		const oldImages = await oldImagesDb.all('SELECT * FROM images WHERE is_generated = 0');
		for (const image of oldImages) {
			await newDb.run(
				'INSERT OR IGNORE INTO uploaded_images (filename, original_name, mime_type, created_at) VALUES (?, ?, ?, ?)',
				[image.filename, image.originalName, image.type, image.created_at]
			);
		}
		
		const oldGeneratedImages = await oldGeneratedDb.all('SELECT * FROM generated_images');
		for (const image of oldGeneratedImages) {
			await newDb.run(
				'INSERT OR IGNORE INTO generated_images (filename, prompt, company_name, created_at) VALUES (?, ?, ?, ?)',
				[image.filename, image.prompt, image.company_name, image.created_at]
			);
		}
		
		await oldImagesDb.close();
		await oldGeneratedDb.close();
		await newDb.close();
		
		console.log('Migration completed successfully!');
		console.log('You can now safely delete the old database files:');
		console.log('- images.db');
		console.log('- generated_images.db');
		
	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}
}

migrate();