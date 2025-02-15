import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/environment.js';
import { claudeChatHistoryRepository } from '../db/models/ClaudeChatHistoryRepository.js';

class ClaudeService {
	constructor() {
		if (!config.anthropicApiKey) {
			throw new Error('Anthropic API key is not configured');
		}
		
		this.client = new Anthropic({
			apiKey: config.anthropicApiKey
		});
		
		this.defaultContextSize = 20;
	}
	
	filterChatHistory(messages) {
		return messages.filter(msg => {
			if (msg.role === 'assistant') {
				const content = msg.content;
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
			console.log('ClaudeService - Starting prompt generation:', {
				customPrompt,
				requestedContextSize: contextSize
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
						type: "image",
						source: {
							type: "base64",
							media_type: "image/jpeg",
							data: base64Image
						}
					}
				]
			};
			
			await claudeChatHistoryRepository.saveMessage(userMessage.role, userMessage.content);
			const chatHistory = await claudeChatHistoryRepository.getLastMessages(contextSize);
			
			const filteredHistory = this.filterChatHistory(chatHistory);
			
			const response = await this.client.messages.create({
				model: "claude-3-5-sonnet-20241022",
				max_tokens: 4096,
				temperature: 0.7,
				messages: [
					...filteredHistory,
					{
					role: "user",
					content: [
						{
							type: "text",
							text: customPrompt
						},
						{
							type: "image",
							source: {
								type: "base64",
								media_type: "image/jpeg",
								data: base64Image
							}
						}
					]
				}]
			});
			
			const assistantMessage = response.content[0];
			
			await claudeChatHistoryRepository.saveMessage('assistant', assistantMessage.text);
			const updatedHistory = await claudeChatHistoryRepository.getLastMessages(contextSize);
			
			return {
				prompt: assistantMessage.text,
				context: updatedHistory,
				totalMessages: await claudeChatHistoryRepository.getMessagesCount()
			};
		} catch (error) {
			console.error('ClaudeService - Error:', error);
			throw new Error('Failed to generate prompt with Claude: ' + error.message);
		}
	}
	
	async regeneratePrompt(context, userPrompt, contextSize = 5) {
		try {
			console.log('ClaudeService - Regenerating prompt with context size:', contextSize);
			
			const messages = context.map(msg => ({
				role: msg.role,
				content: typeof msg.content === 'string' ? msg.content : msg.content.text
			}));
			
			if (userPrompt) {
				messages.push({
					role: "user",
					content: userPrompt
				});
			}
			
			const response = await this.client.messages.create({
				model: "claude-3-5-sonnet-20241022",
				max_tokens: 4096,
				messages: messages,
				temperature: 0.7,
			});
			
			const assistantMessage = response.content[0];
			
			if (assistantMessage.text.toLowerCase().includes("sorry") ||
				assistantMessage.text.toLowerCase().includes("can't assist")) {
				throw new Error("Received invalid response from model. Regenerating...");
			}
			
			await claudeChatHistoryRepository.saveMessage('assistant', assistantMessage.text);
			const updatedHistory = await claudeChatHistoryRepository.getLastMessages(contextSize);
			
			return {
				prompt: assistantMessage.text,
				context: updatedHistory,
				totalMessages: await claudeChatHistoryRepository.getMessagesCount()
			};
		} catch (error) {
			console.error('ClaudeService - Error:', error);
			throw new Error('Failed to regenerate prompt with Claude: ' + error.message);
		}
	}
	
	async getAllHistory() {
		return await claudeChatHistoryRepository.getAllMessages();
	}
	
	async getHistoryCount() {
		return await claudeChatHistoryRepository.getMessagesCount();
	}
	
	async clearChat() {
		await claudeChatHistoryRepository.clearHistory();
	}
	
	setDefaultContextSize(size) {
		this.defaultContextSize = size;
	}
}

export const claudeService = new ClaudeService();