import { getDb } from './Database.js';

class PromptPresetsRepository {
	async getAll() {
		const db = await getDb();
		try {
			return await db.all('SELECT * FROM prompt_presets ORDER BY created_at DESC');
		} catch (error) {
			console.error('Error fetching prompt presets:', error);
			throw new Error('Failed to fetch prompt presets');
		}
	}
	
	async getById(id) {
		const db = await getDb();
		try {
			return await db.get('SELECT * FROM prompt_presets WHERE id = ?', id);
		} catch (error) {
			console.error('Error fetching prompt preset:', error);
			throw new Error('Failed to fetch prompt preset');
		}
	}
	
	async create(name, prompt) {
		const db = await getDb();
		try {
			const result = await db.run(
				'INSERT INTO prompt_presets (name, prompt) VALUES (?, ?)',
				[name, prompt]
			);
			return result.lastID;
		} catch (error) {
			console.error('Error creating prompt preset:', error);
			throw new Error('Failed to create prompt preset');
		}
	}
	
	async update(id, name, prompt) {
		const db = await getDb();
		try {
			await db.run(
				'UPDATE prompt_presets SET name = ?, prompt = ? WHERE id = ?',
				[name, prompt, id]
			);
		} catch (error) {
			console.error('Error updating prompt preset:', error);
			throw new Error('Failed to update prompt preset');
		}
	}
	
	async delete(id) {
		const db = await getDb();
		try {
			await db.run('DELETE FROM prompt_presets WHERE id = ?', id);
		} catch (error) {
			console.error('Error deleting prompt preset:', error);
			throw new Error('Failed to delete prompt preset');
		}
	}
}

export const promptPresetsRepository = new PromptPresetsRepository();