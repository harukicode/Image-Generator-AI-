import { promptApi } from '@/features/prompt-management/api/promptApi.js'
import { create } from 'zustand';

export const usePromptsOnlyStore = create((set, get) => ({
	// Base states
	uploadedImage: null,
	contextSize: 20,
	companyName: "",
	customPrompt: "",
	userPrompt: "",
	currentPrompt: "",
	isGeneratingPrompt: false,
	error: null,
	chatContext: null, // Added this from usePromptGeneration
	
	// Basic setters
	setUploadedImage: (image) => set({ uploadedImage: image }),
	setContextSize: (size) => set({ contextSize: size }),
	setCompanyName: (name) => set({ companyName: name }),
	setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
	setUserPrompt: (prompt) => set({ userPrompt: prompt }),
	setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
	
	// Helper function for company name replacement
	replaceCompanyName: (prompt, companyName) => {
		if (!companyName) return prompt;
		return prompt.replace(/XYZ/g, companyName);
	},
	
	// Generate prompt with API integration
	generatePrompt: async (image, contextSize, companyName) => {
		const state = get();
		
		if (!image || !state.customPrompt) {
			throw new Error("Please provide both an image and a prompt");
		}
		
		set({ isGeneratingPrompt: true, error: null, chatContext: null });
		
		try {
			const processedPrompt = state.replaceCompanyName(state.customPrompt, companyName);
			const response = await promptApi.generatePrompt(image, processedPrompt, contextSize);
			
			if (response.success) {
				set({
					currentPrompt: response.data.prompt,
					chatContext: response.data.context
				});
			} else {
				throw new Error(response.error || "Prompt generation failed");
			}
		} catch (err) {
			console.error('Generate prompt error:', err);
			set({ error: err.message });
			throw err;
		} finally {
			set({ isGeneratingPrompt: false });
		}
	},
	
	// Regenerate prompt with API integration
	regeneratePrompt: async (userPrompt, contextSize, companyName) => {
		const state = get();
		set({ isGeneratingPrompt: true, error: null });
		
		try {
			const processedUserPrompt = state.replaceCompanyName(userPrompt, companyName);
			const response = await promptApi.regeneratePrompt(state.chatContext, processedUserPrompt);
			
			if (response.success) {
				set({
					currentPrompt: response.data.prompt,
					chatContext: response.data.context
				});
			} else {
				throw new Error(response.error || "Prompt regeneration failed");
			}
		} catch (err) {
			console.error('Regenerate prompt error:', err);
			set({ error: err.message });
			throw err;
		} finally {
			set({ isGeneratingPrompt: false });
		}
	},
	
	// Reset functionality
	reset: () => set({
		uploadedImage: null,
		contextSize: 20,
		companyName: "",
		customPrompt: "",
		userPrompt: "",
		currentPrompt: "",
		error: null,
		isGeneratingPrompt: false,
		chatContext: null
	})
}));