import axios from 'axios';

export const promptsApi = {
	// Presets
	getAllPresets: async () => {
		try {
			const response = await axios.get('http://localhost:3000/api/prompts/presets');
			return response.data;
		} catch (error) {
			console.error('API Error:', error.response?.data || error);
			throw new Error(error.response?.data?.error || 'Failed to fetch presets');
		}
	},
	
	createPreset: async (preset) => {
		try {
			const response = await axios.post('http://localhost:3000/api/prompts/presets', preset);
			return response.data;
		} catch (error) {
			console.error('API Error:', error.response?.data || error);
			throw new Error(error.response?.data?.error || 'Failed to create preset');
		}
	},
	
	updatePreset: async (id, preset) => {
		try {
			const response = await axios.put(`http://localhost:3000/api/prompts/presets/${id}`, preset);
			return response.data;
		} catch (error) {
			console.error('API Error:', error.response?.data || error);
			throw new Error(error.response?.data?.error || 'Failed to update preset');
		}
	},
	
	deletePreset: async (id) => {
		try {
			const response = await axios.delete(`http://localhost:3000/api/prompts/presets/${id}`);
			return response.data;
		} catch (error) {
			console.error('API Error:', error.response?.data || error);
			throw new Error(error.response?.data?.error || 'Failed to delete preset');
		}
	},
	
	// Additions
	getAllAdditions: async () => {
		try {
			const response = await axios.get('http://localhost:3000/api/prompts/additions');
			return response.data;
		} catch (error) {
			console.error('API Error:', error.response?.data || error);
			throw new Error(error.response?.data?.error || 'Failed to fetch additions');
		}
	},
	
	createAddition: async (addition) => {
		try {
			const response = await axios.post('http://localhost:3000/api/prompts/additions', addition);
			return response.data;
		} catch (error) {
			console.error('API Error:', error.response?.data || error);
			throw new Error(error.response?.data?.error || 'Failed to create addition');
		}
	},
	
	updateAddition: async (id, addition) => {
		try {
			const response = await axios.put(`http://localhost:3000/api/prompts/additions/${id}`, addition);
			return response.data;
		} catch (error) {
			console.error('API Error:', error.response?.data || error);
			throw new Error(error.response?.data?.error || 'Failed to update addition');
		}
	},
	
	deleteAddition: async (id) => {
		try {
			const response = await axios.delete(`http://localhost:3000/api/prompts/additions/${id}`);
			return response.data;
		} catch (error) {
			console.error('API Error:', error.response?.data || error);
			throw new Error(error.response?.data?.error || 'Failed to delete addition');
		}
	}
};