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
			console.log('OpenAIService - Generating prompt with context size:', contextSize);
			
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
			
			console.log('OpenAIService - Sending request with context length:', chatHistory.length);
			
			const response = await this.client.chat.completions.create({
				model: "chatgpt-4o-latest",
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
				model: "chatgpt-4o-latest",
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