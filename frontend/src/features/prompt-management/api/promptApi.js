import axios from 'axios'

export const promptApi = {
	generatePrompt: async (image, customPrompt) => {
		const formData = new FormData()
		formData.append("image", image)
		formData.append("customPrompt", customPrompt)
		
		const response = await axios.post("http://localhost:3000/api/generate-prompt", formData, {
			headers: { "Content-Type": "multipart/form-data" }
		})
		return response.data
	},
	
	regeneratePrompt: async (context, userPrompt) => {
		const response = await axios.post("http://localhost:3000/api/regenerate-prompt", {
			context,
			userPrompt: userPrompt || undefined
		})
		return response.data
	}
}