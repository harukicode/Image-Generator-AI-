import { promptPresetsRepository } from '../db/models/PromptPresetsRepository.js';
import { promptAdditionsRepository } from '../db/models/PromptAdditionsRepository.js';
import { ResponseFormatter } from '../utils/asyncHandler.js';

export const PromptController = {
	// Presets
	async getAllPresets(req, res) {
		try {
			const presets = await promptPresetsRepository.getAll();
			res.json(ResponseFormatter.success({ presets }));
		} catch (error) {
			res.status(500).json(ResponseFormatter.error(error.message));
		}
	},
	
	async createPreset(req, res) {
		try {
			const { name, prompt } = req.body;
			if (!name || !prompt) {
				return res.status(400).json(ResponseFormatter.error('Name and prompt are required'));
			}
			
			const id = await promptPresetsRepository.create(name, prompt);
			const preset = await promptPresetsRepository.getById(id);
			res.json(ResponseFormatter.success({ preset }));
		} catch (error) {
			res.status(500).json(ResponseFormatter.error(error.message));
		}
	},
	
	async updatePreset(req, res) {
		try {
			const { id } = req.params;
			const { name, prompt } = req.body;
			
			if (!name || !prompt) {
				return res.status(400).json(ResponseFormatter.error('Name and prompt are required'));
			}
			
			await promptPresetsRepository.update(id, name, prompt);
			const preset = await promptPresetsRepository.getById(id);
			res.json(ResponseFormatter.success({ preset }));
		} catch (error) {
			res.status(500).json(ResponseFormatter.error(error.message));
		}
	},
	
	async deletePreset(req, res) {
		try {
			const { id } = req.params;
			await promptPresetsRepository.delete(id);
			res.json(ResponseFormatter.success({ message: 'Preset deleted successfully' }));
		} catch (error) {
			res.status(500).json(ResponseFormatter.error(error.message));
		}
	},
	
	// Additions
	async getAllAdditions(req, res) {
		try {
			const additions = await promptAdditionsRepository.getAll();
			res.json(ResponseFormatter.success({ additions }));
		} catch (error) {
			res.status(500).json(ResponseFormatter.error(error.message));
		}
	},
	
	async createAddition(req, res) {
		try {
			const { name, content } = req.body;
			if (!name || !content) {
				return res.status(400).json(ResponseFormatter.error('Name and content are required'));
			}
			
			const id = await promptAdditionsRepository.create(name, content);
			const addition = await promptAdditionsRepository.getById(id);
			res.json(ResponseFormatter.success({ addition }));
		} catch (error) {
			res.status(500).json(ResponseFormatter.error(error.message));
		}
	},
	
	async updateAddition(req, res) {
		try {
			const { id } = req.params;
			const { name, content } = req.body;
			
			if (!name || !content) {
				return res.status(400).json(ResponseFormatter.error('Name and content are required'));
			}
			
			await promptAdditionsRepository.update(id, name, content);
			const addition = await promptAdditionsRepository.getById(id);
			res.json(ResponseFormatter.success({ addition }));
		} catch (error) {
			res.status(500).json(ResponseFormatter.error(error.message));
		}
	},
	
	async deleteAddition(req, res) {
		try {
			const { id } = req.params;
			await promptAdditionsRepository.delete(id);
			res.json(ResponseFormatter.success({ message: 'Addition deleted successfully' }));
		} catch (error) {
			res.status(500).json(ResponseFormatter.error(error.message));
		}
	}
};