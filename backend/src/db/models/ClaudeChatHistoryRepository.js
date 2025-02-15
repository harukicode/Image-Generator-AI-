import { getDb } from './Database.js';

class ClaudeChatHistoryRepository {
	async saveMessage(role, content) {
		const db = await getDb();
		try {
			const formattedContent = Array.isArray(content)
				? content.find(item => item.type === 'text')?.text || content
				: content;
			
			const result = await db.run(
				'INSERT INTO claude_chat_history (role, content) VALUES (?, ?)',
				[role, JSON.stringify(formattedContent)]
			);
			return result.lastID;
		} catch (error) {
			console.error('Error saving Claude chat message:', error);
			throw new Error('Failed to save Claude chat message');
		}
	}
	
	async getLastMessages(limit) {
		const db = await getDb();
		try {
			const messages = await db.all(
				'SELECT * FROM claude_chat_history ORDER BY created_at DESC LIMIT ?',
				[limit]
			);
			return messages
				.map(msg => ({
					role: msg.role,
					content: JSON.parse(msg.content)
				}))
				.reverse();
		} catch (error) {
			console.error('Error fetching Claude chat history:', error);
			throw new Error('Failed to fetch Claude chat history');
		}
	}
	
	async getAllMessages() {
		const db = await getDb();
		try {
			const messages = await db.all(
				'SELECT * FROM claude_chat_history ORDER BY created_at ASC'
			);
			return messages.map(msg => ({
				id: msg.id,
				role: msg.role,
				content: JSON.parse(msg.content),
				created_at: msg.created_at
			}));
		} catch (error) {
			console.error('Error fetching all Claude chat history:', error);
			throw new Error('Failed to fetch Claude chat history');
		}
	}
	
	async getMessagesCount() {
		const db = await getDb();
		try {
			const result = await db.get('SELECT COUNT(*) as count FROM claude_chat_history');
			return result.count;
		} catch (error) {
			console.error('Error getting Claude messages count:', error);
			throw new Error('Failed to get Claude messages count');
		}
	}
	
	async clearHistory() {
		const db = await getDb();
		try {
			await db.run('DELETE FROM claude_chat_history');
		} catch (error) {
			console.error('Error clearing Claude chat history:', error);
			throw new Error('Failed to clear Claude chat history');
		}
	}
}

export const claudeChatHistoryRepository = new ClaudeChatHistoryRepository();