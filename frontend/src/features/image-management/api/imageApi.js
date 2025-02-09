import axios from 'axios'

export const imageApi = {
	deleteImage: async (filename) => {
		const response = await axios.delete(`http://localhost:3000/api/generated-images/${filename}`)
		return response.data
	}
}