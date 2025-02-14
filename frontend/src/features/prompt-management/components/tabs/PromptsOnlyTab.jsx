import { usePromptsOnlyStore } from '@/stores/PromptsOnlyStore';
import BaseGenerationSection from '@/features/prompt-management/components/BaseGenerationSection/BaseGenerationSection';
import { motion } from 'framer-motion';

export function PromptsOnlyTab() {
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
		error,
		generatePrompt,
		regeneratePrompt,
		reset,
		isNewPrompt,
		updateCurrentPrompt,
		resetPromptOnly
	} = usePromptsOnlyStore();
	
	// Создаем обработчики, использующие методы стора
	const handleStartPromptGeneration = () => {
		generatePrompt(uploadedImage, contextSize, companyName);
	};
	
	const handleRegeneratePrompt = () => {
		regeneratePrompt(userPrompt, contextSize, companyName);
	};
	
	return (
		<div className="h-full w-full">
			<div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 h-full">
				<BaseGenerationSection
					isNewPrompt={isNewPrompt}
					customPrompt={customPrompt}
					setCustomPrompt={setCustomPrompt}
					onStartPromptGeneration={handleStartPromptGeneration}
					onRegeneratePrompt={handleRegeneratePrompt}
					currentPrompt={currentPrompt}
					userPrompt={userPrompt}
					setUserPrompt={setUserPrompt}
					isGeneratingPrompt={isGeneratingPrompt}
					isStartDisabled={!uploadedImage || !customPrompt}
					contextSize={contextSize}
					setContextSize={setContextSize}
					companyName={companyName}
					setCompanyName={setCompanyName}
					uploadedImage={uploadedImage}
					setUploadedImage={setUploadedImage}
					onReset={reset}
					resetPromptOnly={resetPromptOnly}
					updateCurrentPrompt={updateCurrentPrompt}
				/>
				
				{error && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg"
					>
						{error}
					</motion.div>
				)}
			</div>
		</div>
	);
}