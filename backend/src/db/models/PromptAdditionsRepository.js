import { getDb } from './Database.js';

class PromptAdditionsRepository {
	async getAll() {
		const db = await getDb();
		try {
			return await db.all('SELECT * FROM prompt_additions ORDER BY created_at DESC');
		} catch (error) {
			console.error('Error fetching prompt additions:', error);
			throw new Error('Failed to fetch prompt additions');
		}
	}
	
	async getById(id) {
		const db = await getDb();
		try {
			return await db.get('SELECT * FROM prompt_additions WHERE id = ?', id);
		} catch (error) {
			console.error('Error fetching prompt addition:', error);
			throw new Error('Failed to fetch prompt addition');
		}
	}
	
	async create(name, content) {
		const db = await getDb();
		try {
			const result = await db.run(
				'INSERT INTO prompt_additions (name, content) VALUES (?, ?)',
				[name, content]
			);
			return result.lastID;
		} catch (error) {
			console.error('Error creating prompt addition:', error);
			throw new Error('Failed to create prompt addition');
		}
	}
	
	async update(id, name, content) {
		const db = await getDb();
		try {
			await db.run(
				'UPDATE prompt_additions SET name = ?, content = ? WHERE id = ?',
				[name, content, id]
			);
		} catch (error) {
			console.error('Error updating prompt addition:', error);
			throw new Error('Failed to update prompt addition');
		}
	}
	
	async delete(id) {
		const db = await getDb();
		try {
			await db.run('DELETE FROM prompt_additions WHERE id = ?', id);
		} catch (error) {
			console.error('Error deleting prompt addition:', error);
			throw new Error('Failed to delete prompt addition');
		}
	}
}

export const promptAdditionsRepository = new PromptAdditionsRepository();