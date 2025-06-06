import { useFullGenerationStore } from "@/stores/fullGenerationStore"
import { ResultSection } from "@/features/image-management/components/results/ResultSection"
import FullGenerationSection from "@/features/prompt-management/components/GenerationSection/FullGenerationSection"
import { motion } from "framer-motion"

export function FullGenerationTab() {
	const {
		uploadedImage,
		setUploadedImage,
		contextSize,
		setContextSize,
		companyName,
		setCompanyName,
		currentPrompt,
		userPrompt,
		setUserPrompt,
		customPrompt,
		setCustomPrompt,
		isGeneratingPrompt,
		isGeneratingImages,
		numImages,
		setNumImages,
		magicPrompt,
		setMagicPrompt,
		generatedImages,
		generationProgress,
		error,
		generatePrompt,
		regeneratePrompt,
		generateImages,
		deleteImage,
		reset,
		isNewPrompt,
		updateCurrentPrompt,
		resetPromptOnly,
		isHistoryEnabled,
		setIsHistoryEnabled,
		selectedModel,
		setSelectedModel,
	} = useFullGenerationStore()
	
	const handleStartPromptGeneration = () => {
		generatePrompt(uploadedImage, contextSize, companyName, selectedModel)
	}
	
	const handleRegeneratePrompt = () => {
		regeneratePrompt(userPrompt, contextSize, companyName, selectedModel)
	}
	
	const handleGenerateNewPrompt = () => {
		generatePrompt(uploadedImage, contextSize, companyName, selectedModel)
	}
	
	return (
		<div className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-full">
			<div className="flex-1 h-full">
				<div className="bg-white rounded-2xl shadow-sm p-4 h-full">
					<FullGenerationSection
						isNewPrompt={isNewPrompt}
						customPrompt={customPrompt}
						setCustomPrompt={setCustomPrompt}
						onStartPromptGeneration={handleStartPromptGeneration}
						onRegeneratePrompt={handleRegeneratePrompt}
						onGenerate={() => generateImages(currentPrompt)}
						currentPrompt={currentPrompt}
						userPrompt={userPrompt}
						setUserPrompt={setUserPrompt}
						isGeneratingPrompt={isGeneratingPrompt}
						isGeneratingImages={isGeneratingImages}
						isStartDisabled={!uploadedImage || !customPrompt}
						numImages={numImages}
						setNumImages={setNumImages}
						magicPrompt={magicPrompt}
						setMagicPrompt={setMagicPrompt}
						contextSize={contextSize}
						setContextSize={setContextSize}
						companyName={companyName}
						setCompanyName={setCompanyName}
						uploadedImage={uploadedImage}
						setUploadedImage={setUploadedImage}
						onReset={reset}
						updateCurrentPrompt={updateCurrentPrompt}
						resetPromptOnly={resetPromptOnly}
						isHistoryEnabled={isHistoryEnabled}
						setIsHistoryEnabled={setIsHistoryEnabled}
						selectedModel={selectedModel}
						setSelectedModel={setSelectedModel}
						onGenerateNew={handleGenerateNewPrompt}
					/>
				</div>
			</div>
			
			<motion.div
				className="flex-1"
				initial={{ x: 50, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className="bg-white rounded-2xl shadow-sm p-4 sm:p-4 lg:p-4 h-full">
					<ResultSection
						generatedImages={generatedImages}
						isGenerating={isGeneratingImages}
						error={error}
						onImageDelete={deleteImage}
						generationProgress={generationProgress}
						isHistoryEnabled={isHistoryEnabled}
					/>
				</div>
			</motion.div>
		</div>
	)
}

