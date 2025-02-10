import { getDb } from './Database.js';

class GeneratedImagesRepository {

	async save(filename, prompt, companyName, originalImageId = null) {
		const db = await getDb();
		try {
			const result = await db.run(
				`INSERT INTO generated_images
                (filename, prompt, company_name, original_image_id)
                VALUES (?, ?, ?, ?)`,
				[filename, prompt, companyName, originalImageId]
			);
			return result.lastID;
		} catch (error) {
			console.error('Error saving generated image:', error);
			throw new Error('Failed to save generated image to database');
		}
	}
	
	
	async getAll() {
		const db = await getDb();
		try {
			const query = `
      SELECT
        gi.*,
        ui.filename as original_filename,
        ui.original_name as original_image_name
      FROM generated_images gi
      LEFT JOIN uploaded_images ui ON gi.original_image_id = ui.id
      ORDER BY gi.created_at DESC
    `;
			console.log('Executing SQL query:', query);
			const results = await db.all(query);
			console.log('Query results:', results);
			return results;
		} catch (error) {
			console.error('Error fetching generated images:', error);
			throw new Error('Failed to fetch generated images from database');
		}
	}
	

	async getByFilename(filename) {
		const db = await getDb();
		try {
			return await db.get(`
                SELECT
                    gi.*,
                    ui.filename as original_filename,
                    ui.original_name as original_image_name
                FROM generated_images gi
                LEFT JOIN uploaded_images ui ON gi.original_image_id = ui.id
                WHERE gi.filename = ?
            `, filename);
		} catch (error) {
			console.error('Error fetching generated image:', error);
			throw new Error('Failed to fetch generated image from database');
		}
	}
	

	async delete(id) {
		const db = await getDb();
		try {
			await db.run('DELETE FROM generated_images WHERE id = ?', id);
		} catch (error) {
			console.error('Error deleting generated image:', error);
			throw new Error('Failed to delete generated image from database');
		}
	}
	

	async getByCompany(companyName) {
		const db = await getDb();
		try {
			return await db.all(`
                SELECT
                    gi.*,
                    ui.filename as original_filename,
                    ui.original_name as original_image_name
                FROM generated_images gi
                LEFT JOIN uploaded_images ui ON gi.original_image_id = ui.id
                WHERE gi.company_name = ?
                ORDER BY gi.created_at DESC
            `, companyName);
		} catch (error) {
			console.error('Error fetching company images:', error);
			throw new Error('Failed to fetch company images from database');
		}
	}
}

export const generatedImagesRepository = new GeneratedImagesRepository();