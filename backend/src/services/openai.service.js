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
	
	filterChatHistory(messages) {
		return messages.filter(msg => {
			if (msg.role === 'assistant') {
				const content = typeof msg.content === 'string'
					? msg.content
					: msg.content.find(part => part.type === 'text')?.text || '';
				
				const isRefusal = content.toLowerCase().includes("i can't assist with that") ||
					content.toLowerCase().includes("i cannot assist with that") ||
					content.toLowerCase().includes("i am unable to assist");
				
				return !isRefusal;
			}
			return true;
		});
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
					{
						type: "text",
						text: customPrompt
					},
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
			
			const filteredHistory = this.filterChatHistory(chatHistory);
			const messages = [...filteredHistory];
			
			console.log('OpenAIService - Filtered chat history:', {
				requestedMessages: contextSize,
				originalMessages: chatHistory.length,
				filteredMessages: filteredHistory.length,
				messages: messages.map(msg => ({
					role: msg.role,
					contentType: Array.isArray(msg.content) ? 'multipart' : 'text',
					text: Array.isArray(msg.content)
						? msg.content.find(part => part.type === 'text')?.text
						: msg.content
				}))
			});
			
			const response = await this.client.chat.completions.create({
				model: "chatgpt-4o-latest",
				messages: messages,
				max_tokens: 5000,
				temperature: 0.7,
			});
			
			const assistantMessage = response.choices[0].message;
			
			if (assistantMessage.content.toLowerCase().includes("sorry") ||
				assistantMessage.content.toLowerCase().includes("can't assist")) {
				throw new Error("Received invalid response from model. Regenerating...");
			}
			
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
	
	async regeneratePrompt(context, userPrompt, contextSize = 5) {
		try {
			console.log('OpenAIService - Regenerating prompt with context size:', contextSize);
			
			if (userPrompt) {
				await chatHistoryRepository.saveMessage("user", userPrompt);
			}
			
			const chatHistory = await chatHistoryRepository.getLastMessages(contextSize);
			const filteredHistory = this.filterChatHistory(chatHistory);
			const messages = [...filteredHistory];
			
			const response = await this.client.chat.completions.create({
				model: "chatgpt-4o-latest",
				messages: messages,
				max_tokens: 5000,
				temperature: 0.7,
			});
			
			const assistantMessage = response.choices[0].message;
			
			if (assistantMessage.content.toLowerCase().includes("sorry") ||
				assistantMessage.content.toLowerCase().includes("can't assist")) {
				throw new Error("Received invalid response from model. Regenerating...");
			}
			
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