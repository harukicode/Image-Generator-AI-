import { promptApi } from '@/features/prompt-management/api/promptApi.js'
import { create } from 'zustand';
import { createBatches, generateAllBatches } from '@/shared/utils/batchImageGeneration';

export const useFullGenerationStore = create((set, get) => ({
	// Базовые состояния
	uploadedImage: null,
	contextSize: 20,
	companyName: "",
	customPrompt: "",
	userPrompt: "",
	currentPrompt: "",
	isGeneratingPrompt: false,
	error: null,
	chatContext: null, // Добавляем из usePromptGeneration
	
	// Состояния для генерации изображений
	numImages: 4,
	magicPrompt: "AUTO",
	isGeneratingImages: false,
	generatedImages: [],
	generationProgress: {
		totalBatches: 0,
		completedBatches: 0,
	},
	
	// Базовые действия
	setUploadedImage: (image) => set({ uploadedImage: image }),
	setContextSize: (size) => set({ contextSize: size }),
	setCompanyName: (name) => set({ companyName: name }),
	setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
	setUserPrompt: (prompt) => set({ userPrompt: prompt }),
	setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
	setIsGeneratingPrompt: (isGenerating) => set({ isGeneratingPrompt: isGenerating }),
	setError: (error) => set({ error }),
	
	// Действия для генерации изображений
	setNumImages: (num) => set({ numImages: num }),
	setMagicPrompt: (prompt) => set({ magicPrompt: prompt }),
	setIsGeneratingImages: (isGenerating) => set({ isGeneratingImages: isGenerating }),
	setGeneratedImages: (images) => set({ generatedImages: images }),
	setGenerationProgress: (progress) => set({ generationProgress: progress }),
	
	// Вспомогательные функции
	replaceCompanyName: (prompt, companyName) => {
		if (!companyName) return prompt;
		return prompt.replace(/XYZ/g, companyName);
	},
	
	// Генерация промптов
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
	
	// Регенерация промптов
	regeneratePrompt: async (userPrompt, contextSize, companyName) => {
		const state = get();
		set({ isGeneratingPrompt: true, error: null });
		
		try {
			const processedPrompt = state.replaceCompanyName(userPrompt, companyName);
			const response = await promptApi.regeneratePrompt(state.chatContext, processedPrompt);
			
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
	
	// Генерация изображений
	generateImages: async (currentPrompt) => {
		const state = get();
		if (!currentPrompt || !state.numImages) {
			throw new Error("Please provide a prompt and number of images");
		}
		
		set({
			isGeneratingImages: true,
			generatedImages: [],
			error: null
		});
		
		try {
			const batches = createBatches(parseInt(state.numImages));
			
			set({
				generationProgress: {
					totalBatches: batches.length,
					completedBatches: 0,
				}
			});
			
			const images = await generateAllBatches({
				batches,
				prompt: currentPrompt,
				magicPrompt: state.magicPrompt,
				onBatchComplete: ({ completedBatches, allImages }) => {
					set(state => ({
						generationProgress: {
							...state.generationProgress,
							completedBatches
						},
						generatedImages: allImages
					}));
				},
				onError: (error) => {
					set({ error: error.message });
				}
			});
			
			set({ generatedImages: images });
		} catch (err) {
			console.error('Generation error:', err);
			set({ error: err.message });
			throw err;
		} finally {
			set({ isGeneratingImages: false });
		}
	},
	
	// Удаление изображений
	deleteImage: (imageFilename) => {
		set(state => ({
			generatedImages: state.generatedImages.filter(img => {
				const currentFilename = typeof img === 'string'
					? img.split('/').pop()
					: img.filename;
				return currentFilename !== imageFilename;
			})
		}));
	},
	
	// Сброс состояний
	reset: () => set({
		uploadedImage: null,
		contextSize: 20,
		companyName: "",
		customPrompt: "",
		userPrompt: "",
		currentPrompt: "",
		error: null,
		chatContext: null
	}),
	
	resetAll: () => set({
		// Сброс базовых состояний
		uploadedImage: null,
		contextSize: 20,
		companyName: "",
		customPrompt: "",
		userPrompt: "",
		currentPrompt: "",
		error: null,
		chatContext: null,
		// Сброс состояний генерации изображений
		numImages: 4,
		magicPrompt: "AUTO",
		isGeneratingImages: false,
		generatedImages: [],
		generationProgress: {
			totalBatches: 0,
			completedBatches: 0,
		}
	})
}));