import OpenAI from 'openai';
import { config } from '../config/environment.js';

class OpenAIService {
	constructor() {
		if (!config.openaiApiKey) {
			throw new Error('OpenAI API key is not configured');
		}
		
		this.client = new OpenAI({
			apiKey: config.openaiApiKey
		});
	}
	
	async generatePrompt(imageBuffer, customPrompt) {
		try {
			console.log('OpenAIService - Generating prompt, custom prompt:', customPrompt);
			
			const base64Image = imageBuffer.toString('base64');
			
			const messages = [{
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
			}];
			
			console.log('OpenAIService - Sending request to OpenAI');
			
			const response = await this.client.chat.completions.create({
				model: "chatgpt-4o-latest",
				messages: messages,
				max_tokens: 5000,
			});
			
			console.log('OpenAIService - Received response from OpenAI');
			
			return {
				prompt: response.choices[0].message.content,
				context: messages.concat(response.choices[0].message)
			};
		} catch (error) {
			console.error('OpenAIService - Error:', error);
			

			if (error.response) {
				console.error('OpenAI API Error Response:', {
					status: error.response.status,
					data: error.response.data
				});
			}
			
			throw new Error('Failed to generate prompt with OpenAI: ' + error.message);
		}
	}
	
	async regeneratePrompt(context, userPrompt) {
		try {
			console.log('OpenAIService - Regenerating prompt');
			
			const messages = [...context];
			if (userPrompt) {
				messages.push({
					role: "user",
					content: userPrompt
				});
			}
			
			const response = await this.client.chat.completions.create({
				model: "chatgpt-4o-latest",
				messages: messages,
				max_tokens: 5000,
			});
			
			return {
				prompt: response.choices[0].message.content,
				context: messages.concat(response.choices[0].message)
			};
		} catch (error) {
			console.error('OpenAIService - Error:', error);
			throw new Error('Failed to regenerate prompt with OpenAI: ' + error.message);
		}
	}
}

export const openAIService = new OpenAIService();