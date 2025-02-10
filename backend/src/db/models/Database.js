import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { config } from '../../config/environment.js';

let db = null;

export async function initializeDb() {
	if (db) return db;
	
	db = await open({
		filename: path.join(config.paths.uploads, '../database.sqlite'),
		driver: sqlite3.Database
	});
	
	await db.exec(`
        -- Table for uploaded images
        CREATE TABLE IF NOT EXISTS uploaded_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL UNIQUE,
            original_name TEXT,
            mime_type TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Table for generated images
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

        -- Table for prompt presets
        CREATE TABLE IF NOT EXISTS prompt_presets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            prompt TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Table for prompt additions
        CREATE TABLE IF NOT EXISTS prompt_additions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
	
	return db;
}

export async function getDb() {
	if (!db) {
		await initializeDb();
	}
	return db;
}

export async function closeDb() {
	if (db) {
		await db.close();
		db = null;
	}
}