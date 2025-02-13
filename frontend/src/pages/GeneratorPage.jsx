import { ImageProvider } from '@/features/image-management/components/ui/ImageContext.jsx'
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import ImageUploadDialog from '@/widgets/image-upload/ImageUploadDialog';
import GenerationSection from "@/features/prompt-management/components/GenerationSection/GenerationSection";
import { ResultSection } from "@/features/image-management/components/results/ResultSection";
import ImageLibraryPage from "@/features/image-management/components/library/components/GeneratedImagesLibrary";
import { usePromptGeneration } from "@/features/prompt-management/hooks/usePromptGeneration";
import { useImageGeneration } from "@/features/image-management/hooks/useImageGeneration";

function GeneratorPage() {
	const [uploadedImage, setUploadedImage] = useState(null);
	const [contextSize, setContextSize] = useState(20);
	const [companyName, setCompanyName] = useState("");
	
	const {
		currentPrompt,
		isGeneratingPrompt,
		error,
		userPrompt,
		setUserPrompt,
		customPrompt,
		setCustomPrompt,
		generatePrompt,
		regeneratePrompt,
		reset: resetPrompt,
	} = usePromptGeneration();
	
	const {
		generatedImages,
		isGeneratingImages,
		numImages,
		setNumImages,
		magicPrompt,
		setMagicPrompt,
		generationProgress,
		generateImages,
		deleteImage,
	} = useImageGeneration();
	
	const handleStartPromptGeneration = () => {
		generatePrompt(uploadedImage, contextSize, companyName);
	};
	
	const handleRegeneratePrompt = () => {
		regeneratePrompt(userPrompt, contextSize, companyName);
	};
	
	const handleReset = () => {
		setUploadedImage(null);
		setUserPrompt('');
		if (resetPrompt) {
			resetPrompt();
		}
	};
	
	return (
		<ImageProvider>
		<div className="w-full flex flex-col min-h-screen">
			
			{/* Основной контент с табами - растягивается на оставшуюся высоту */}
			<Tabs defaultValue="image-generator" className="flex-1 flex flex-col w-full">
				{/* Навигация с полной шириной */}
				<div className="w-full px-4 mb-4">
					<TabsList className="w-full bg-white rounded-lg p-1 shadow-sm">
						<TabsTrigger
							value="image-generator"
							className="flex-1 px-4 py-2 data-[state=active]:bg-[#6366F1] data-[state=active]:text-white"
						>
							Image Generator
						</TabsTrigger>
						<TabsTrigger
							value="prompts-only"
							className="flex-1 px-4 py-2 data-[state=active]:bg-[#6366F1] data-[state=active]:text-white"
						>
							Prompts Only
						</TabsTrigger>
						<TabsTrigger
							value="image-library"
							className="flex-1 px-4 py-2 data-[state=active]:bg-[#6366F1] data-[state=active]:text-white"
						>
							Image Library
						</TabsTrigger>
					</TabsList>
				</div>
				
				{/* Контент табов - растягивается на всю доступную ширину и высоту */}
				<div className="flex-1 w-full px-4">
					{/* Таб генератора изображений */}
					<TabsContent value="image-generator" className="h-full w-full mt-0">
						<div className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-full">
							<div className="flex-1 h-full">
								<div className="bg-white rounded-2xl shadow-sm p-4 h-full">
									<GenerationSection
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
										reset={resetPrompt}
										setCompanyName={setCompanyName}
										companyName={companyName}
										uploadedImage={uploadedImage}
										setUploadedImage={setUploadedImage}
										onReset={handleReset}
									/>
								</div>
							</div>
							<motion.div
								className="flex-1"
								initial={{ x: 50, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								<div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 h-full">
									<ResultSection
										generatedImages={generatedImages}
										isGenerating={isGeneratingImages}
										error={error}
										onImageDelete={deleteImage}
										generationProgress={generationProgress}
									/>
								</div>
							</motion.div>
						</div>
					</TabsContent>
					
					{/* Таб только для промптов */}
					<TabsContent value="prompts-only" className="h-full w-full mt-0">
						<div className="h-full w-full">
							<div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 h-full">
								<GenerationSection
									customPrompt={customPrompt}
									setCustomPrompt={setCustomPrompt}
									onStartPromptGeneration={handleStartPromptGeneration}
									onRegeneratePrompt={handleRegeneratePrompt}
									currentPrompt={currentPrompt}
									userPrompt={userPrompt}
									setUserPrompt={setUserPrompt}
									isGeneratingPrompt={isGeneratingPrompt}
									isGeneratingImages={false}
									isStartDisabled={!uploadedImage || !customPrompt}
									contextSize={contextSize}
									setContextSize={setContextSize}
									companyName={companyName}
									setCompanyName={setCompanyName}
									numImages={undefined}
									setNumImages={() => {}}
									magicPrompt={undefined}
									setMagicPrompt={() => {}}
									onGenerate={() => {}}
									reset={resetPrompt}
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
					</TabsContent>
					
					{/* Таб библиотеки изображений */}
					<TabsContent value="image-library" className="h-full w-full mt-0">
						<ImageLibraryPage />
					</TabsContent>
				</div>
			</Tabs>
		</div>
		</ImageProvider>
	);
}

export default GeneratorPage;