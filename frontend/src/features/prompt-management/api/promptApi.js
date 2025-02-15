import axios from 'axios';

export const promptApi = {
	generatePrompt: async (image, customPrompt, contextSize, model = 'gpt') => {
		try {
			const formData = new FormData();
			formData.append("image", image);
			formData.append("customPrompt", customPrompt);
			formData.append("contextSize", contextSize || "");
			formData.append("model", model);
			
			console.log('Sending request with:', {
				hasImage: !!image,
				customPrompt,
				contextSize,
				formDataSize: formData.get('image')?.size,
				model,
			});
			
			const response = await axios.post(
				"http://localhost:3000/api/generate-prompt",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data"
					}
				}
			);
			
			return response.data;
		} catch (error) {
			console.error('API Error:', error.response?.data || error);
			throw new Error(
				error.response?.data?.error ||
				error.message ||
				'Failed to generate prompt'
			);
		}
	},
	
	regeneratePrompt: async (context, userPrompt, model = 'gpt') => {
		try {
			const response = await axios.post(
				"http://localhost:3000/api/regenerate-prompt",
				{
					context,
					userPrompt: userPrompt || undefined,
					model
				}
			);
			return response.data;
		} catch (error) {
			console.error('API Error:', error.response?.data || error);
			throw new Error(
				error.response?.data?.error ||
				error.message ||
				'Failed to regenerate prompt'
			);
		}
	}
};