import { promptApi } from '@/features/prompt-management/api/promptApi.js'
import { create } from 'zustand';
import { createBatches, generateAllBatches } from '@/shared/utils/batchImageGeneration';

export const useFullGenerationStore = create((set, get) => ({
	// Базовые состояния
	uploadedImage: null,
	contextSize: 5,
	companyName: "",
	customPrompt: "",
	userPrompt: "",
	currentPrompt: "",
	isGeneratingPrompt: false,
	error: null,
	chatContext: null,
	isNewPrompt: false,
	isHistoryEnabled: false,
	selectedModel: 'gpt',
	
	// Состояния для генерации изображений
	numImages: 4,
	magicPrompt: "AUTO",
	isGeneratingImages: false,
	generatedImages: [],
	currentBatchSession: null,
	generationProgress: {
		totalBatches: 0,
		completedBatches: 0,
	},
	
	// Базовые действия
	setSelectedModel: (model) => set({ selectedModel: model }),
	setIsHistoryEnabled: (value) => set({ isHistoryEnabled: value }),
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
	generatePrompt: async (image, contextSize, companyName, selectedModel) => {
		const state = get();
		if (!image || !state.customPrompt) {
			throw new Error("Please provide both an image and a prompt");
		}
		
		set({ isGeneratingPrompt: true, error: null, chatContext: null });
		
		try {
			const processedPrompt = state.replaceCompanyName(state.customPrompt, companyName);
			const response = await promptApi.generatePrompt(
				image,
				processedPrompt,
				contextSize,
				selectedModel
			);
			
			if (response.success) {
				set({
					currentPrompt: response.data.prompt,
					chatContext: response.data.context,
					isNewPrompt: true
				});
				
				setTimeout(() => {
					set({ isNewPrompt: false });
				}, 3000);
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
	regeneratePrompt: async (userPrompt, contextSize, companyName, selectedModel) => {
		const state = get();
		set({ isGeneratingPrompt: true, error: null });
		
		try {
			const processedPrompt = state.replaceCompanyName(userPrompt, companyName);
			const response = await promptApi.regeneratePrompt(state.chatContext, processedPrompt, selectedModel);
			
			if (response.success) {
				set({
					currentPrompt: response.data.prompt,
					chatContext: response.data.context,
					isNewPrompt: true
				});
				
				setTimeout(() => {
					set({ isNewPrompt: false });
				}, 3000);
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
	generateImages: async (currentPrompt, forceNewSession = true) => {
		const state = get();
		if (!currentPrompt || !state.numImages) {
			throw new Error("Please provide a prompt and number of images");
		}
		
		const sessionId = forceNewSession ? `${Date.now()}-${currentPrompt}` : state.currentBatchSession;
		
		set({
			isGeneratingImages: true,
			error: null,
			// Очищаем предыдущие изображения только если:
			// 1. История выключена И
			// 2. Начинается новая генерация
			generatedImages: (!state.isHistoryEnabled && forceNewSession)
				? []
				: state.generatedImages
		});
		
		try {
			const batches = createBatches(parseInt(state.numImages));
			
			set({
				currentBatchSession: sessionId,
				generationProgress: {
					totalBatches: batches.length,
					completedBatches: 0,
				}
			});
			
			const newImages = await generateAllBatches({
				batches,
				prompt: currentPrompt,
				magicPrompt: state.magicPrompt,
				onBatchComplete: ({ completedBatches, allImages }) => {
					set(state => ({
						generationProgress: {
							...state.generationProgress,
							completedBatches
						},
						// Добавляем только новые изображения из текущего батча
						generatedImages: [
							...state.generatedImages,
							...allImages.filter(img => !state.generatedImages.includes(img))
						]
					}));
				},
				onError: (error) => {
					set({ error: error.message });
				}
			});
			
			// Добавляем только новые изображения
			set(state => ({
				generatedImages: [
					...state.generatedImages,
					...newImages.filter(img => !state.generatedImages.includes(img))
				]
			}));
			
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
	
	updateCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
	
	resetPromptOnly: () => set({
		currentPrompt: "",
		isNewPrompt: false,
		isGeneratingPrompt: false,
		chatContext: null,
	}),
	
	reset: () => set({
		contextSize: 5,
		companyName: "",
		customPrompt: "",
		userPrompt: "",
		currentPrompt: "",
		error: null,
		chatContext: null,
	}),
	
	resetAll: () => set({
		uploadedImage: null,
		contextSize: 20,
		companyName: "",
		customPrompt: "",
		userPrompt: "",
		currentPrompt: "",
		error: null,
		chatContext: null,
		numImages: 4,
		magicPrompt: "AUTO",
		isGeneratingImages: false,
		generatedImages: [],
		currentBatchSession: null,
		generationProgress: {
			totalBatches: 0,
			completedBatches: 0,
		}
	})
}));