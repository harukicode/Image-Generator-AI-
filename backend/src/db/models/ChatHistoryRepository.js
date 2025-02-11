import { getDb } from './Database.js';

class ChatHistoryRepository {
	async saveMessage(role, content) {
		const db = await getDb();
		try {
			const result = await db.run(
				'INSERT INTO chat_history (role, content) VALUES (?, ?)',
				[role, JSON.stringify(content)]
			);
			return result.lastID;
		} catch (error) {
			console.error('Error saving chat message:', error);
			throw new Error('Failed to save chat message');
		}
	}
	
	async getLastMessages(limit) {
		const db = await getDb();
		try {
			const messages = await db.all(
				'SELECT * FROM chat_history ORDER BY created_at DESC LIMIT ?',
				[limit]
			);
			return messages
				.map(msg => ({
					role: msg.role,
					content: JSON.parse(msg.content)
				}))
				.reverse();
		} catch (error) {
			console.error('Error fetching chat history:', error);
			throw new Error('Failed to fetch chat history');
		}
	}
	
	async getAllMessages() {
		const db = await getDb();
		try {
			const messages = await db.all(
				'SELECT * FROM chat_history ORDER BY created_at ASC'
			);
			return messages.map(msg => ({
				id: msg.id,
				role: msg.role,
				content: JSON.parse(msg.content),
				created_at: msg.created_at
			}));
		} catch (error) {
			console.error('Error fetching all chat history:', error);
			throw new Error('Failed to fetch chat history');
		}
	}
	
	async getMessagesCount() {
		const db = await getDb();
		try {
			const result = await db.get('SELECT COUNT(*) as count FROM chat_history');
			return result.count;
		} catch (error) {
			console.error('Error getting messages count:', error);
			throw new Error('Failed to get messages count');
		}
	}
	
	async clearHistory() {
		const db = await getDb();
		try {
			await db.run('DELETE FROM chat_history');
		} catch (error) {
			console.error('Error clearing chat history:', error);
			throw new Error('Failed to clear chat history');
		}
	}
}
export const chatHistoryRepository = new ChatHistoryRepository();