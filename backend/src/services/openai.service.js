import OpenAI from 'openai';
import { config } from '../config/environment.js';
import { chatHistoryRepository } from '../db/models/ChatHistoryRepository.js';

class OpenAIService {
	constructor() {
		if (!config.openaiApiKey) {
			throw new Error('OpenAI API key is not configured');
		}
		
		this.client = new OpenAI({
			apiKey: config.openaiApiKey
		});
		
		this.defaultContextSize = 20;
	}
	
	async generatePrompt(imageBuffer, customPrompt, contextSize = this.defaultContextSize) {
		try {
			console.log('OpenAIService - Starting prompt generation:', {
				customPrompt,
				requestedContextSize: contextSize,
				defaultContextSize: this.defaultContextSize
			});
			
			const base64Image = imageBuffer.toString('base64');
			
			const userMessage = {
				role: "user",
				content: [
					{ type: "text", text: customPrompt },
					{
						type: "image_url",
						image_url: {
							url: `data:image/jpeg;base64,${base64Image}`,
							detail: "high"
						}
					}
				]
			};
			
			await chatHistoryRepository.saveMessage(userMessage.role, userMessage.content);
			const chatHistory = await chatHistoryRepository.getLastMessages(contextSize);
			
			console.log('OpenAIService - Chat history retrieved:', {
				requestedMessages: contextSize,
				actualMessages: chatHistory.length,
				messages: chatHistory.map(msg => ({
					role: msg.role,
					contentType: Array.isArray(msg.content) ? 'multipart' : 'text',
					text: Array.isArray(msg.content)
						? msg.content.find(part => part.type === 'text')?.text
						: msg.content
				}))
			});
			
			const response = await this.client.chat.completions.create({
				model: "gpt-4o",
				messages: chatHistory,
				max_tokens: 5000,
			});
			
			const assistantMessage = response.choices[0].message;
			await chatHistoryRepository.saveMessage(assistantMessage.role, assistantMessage.content);
			
			const updatedHistory = await chatHistoryRepository.getLastMessages(contextSize);
			
			console.log('OpenAIService - Response generated:', {
				responseLength: assistantMessage.content.length,
				updatedContextSize: updatedHistory.length
			});
			
			return {
				prompt: assistantMessage.content,
				context: updatedHistory,
				totalMessages: await chatHistoryRepository.getMessagesCount()
			};
		} catch (error) {
			console.error('OpenAIService - Error:', error);
			throw new Error('Failed to generate prompt with OpenAI: ' + error.message);
		}
	}
	
	async regeneratePrompt(context, userPrompt, contextSize = this.defaultContextSize) {
		try {
			console.log('OpenAIService - Regenerating prompt with context size:', contextSize);
			
			if (userPrompt) {
				await chatHistoryRepository.saveMessage("user", userPrompt);
			}
			
			const chatHistory = await chatHistoryRepository.getLastMessages(contextSize);
			
			const response = await this.client.chat.completions.create({
				model: "gpt-4o",
				messages: chatHistory,
				max_tokens: 5000,
			});
			
			const assistantMessage = response.choices[0].message;
			await chatHistoryRepository.saveMessage(assistantMessage.role, assistantMessage.content);
			
			const updatedHistory = await chatHistoryRepository.getLastMessages(contextSize);
			
			return {
				prompt: assistantMessage.content,
				context: updatedHistory,
				totalMessages: await chatHistoryRepository.getMessagesCount()
			};
		} catch (error) {
			console.error('OpenAIService - Error:', error);
			throw new Error('Failed to regenerate prompt with OpenAI: ' + error.message);
		}
	}
	
	async getAllHistory() {
		return await chatHistoryRepository.getAllMessages();
	}
	
	async getHistoryCount() {
		return await chatHistoryRepository.getMessagesCount();
	}
	
	async clearChat() {
		await chatHistoryRepository.clearHistory();
	}
	
	setDefaultContextSize(size) {
		this.defaultContextSize = size;
	}
}

export const openAIService = new OpenAIService();