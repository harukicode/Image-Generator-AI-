import AnimatedPromptDisplay
	from '@/features/prompt-management/components/GenerationSection/ui/AnimatedPromptDisplay.jsx'
import ModelSelect from '@/features/prompt-management/components/GenerationSection/ui/ModelSelect.jsx'
import PresetLibrary from '@/features/prompt-management/components/presets/PresetLibrary.jsx'
import PromptAdditionsLibrary from '@/features/prompt-management/components/presets/PromptAdditionsLibrary.jsx'
import { Button } from "@/shared/ui/button"
import { RotateCcw } from "lucide-react"
import PromptInput from "../GenerationSection/PromptInput.jsx"
import ImageUploadDialog from '@/widgets/image-upload/ImageUploadDialog'
import BaseGenerationControls from "./BaseGenerationControls"
import BaseGenerationButtons from "./BaseGenerationButtons"

const BaseGenerationSection = ({
	                               // Базовые пропсы для работы с промптами
	                               customPrompt,
	                               setCustomPrompt,
	                               onStartPromptGeneration,
	                               onRegeneratePrompt,
	                               currentPrompt,
	                               userPrompt,
	                               setUserPrompt,
	                               isGeneratingPrompt,
	                               isStartDisabled,
	                               contextSize,
	                               setContextSize,
	                               companyName,
	                               setCompanyName,
	                               uploadedImage,
	                               setUploadedImage,
	                               onReset,
			                               isNewPrompt,
	                               updateCurrentPrompt,
	                               resetPromptOnly,
	                               selectedModel,
	                               setSelectedModel,
			                               onGenerateNew,
                               }) => {
	// Обработчик сброса базовых настроек
	const handleReset = () => {
		setContextSize(20);
		setUserPrompt('');
		onReset();
	};
	
	return (
		<section className='space-y-2'>
			{/* Заголовок с загрузкой изображения и кнопкой сброса */}
			<header className='flex justify-between items-center'>
				<div className='flex items-center gap-4'>
					<ModelSelect
						value={selectedModel}
						onChange={setSelectedModel}
					/>
					<ImageUploadDialog
						setUploadedImage={setUploadedImage}
						resetPromptOnly={resetPromptOnly}
						uploadedImage={uploadedImage}
					/>
					<Button
						variant='outline'
						size='icon'
						onClick={handleReset}
						className='w-6 h-6 flex-shrink-0'
						title='Reset all settings'
					>
						<RotateCcw className='h-3 w-3' />
					</Button>
				</div>
			</header>
			
			{/* Базовые элементы управления (контекст и название компании) */}
			{/* В секцию контролов добавляем PresetLibrary */}
			<div className='flex flex-wrap items-center gap-2'>
				<div className="flex items-center gap-2 min-w-0">
					<BaseGenerationControls
						className='flex-1 min-w-0'
						contextSize={contextSize}
						setContextSize={setContextSize}
						companyName={companyName}
						setCompanyName={setCompanyName}
					/>
					<PresetLibrary onSelectPreset={setCustomPrompt} />
				</div>
			</div>
			
			{/* Поля ввода промптов */}
			<div className='space-y-2'>
				<PromptInput
					value={customPrompt}
					onChange={setCustomPrompt}
					label='Custom prompt'
					placeholder='Enter your custom prompt...'
					className='text-xs xs:text-sm'
					minHeight='min-h-[80px]'
				/>
				
				{currentPrompt && (
					<div className='space-y-1'>
						<AnimatedPromptDisplay
							prompt={currentPrompt}
							isNew={isNewPrompt}
							onPromptEdit={updateCurrentPrompt}
						/>
						<div className='space-y-1'>
							{/* Добавляем PromptAdditionsLibrary в заголовок секции кастомизации */}
							<div className='flex justify-between items-center'>
								<label className='text-xs font-medium text-gray-700'>
									Customize prompt or provide feedback
								</label>
								<PromptAdditionsLibrary
									onSelectAddition={setUserPrompt}
									className='scale-90'
								/>
							</div>
							<PromptInput
								value={userPrompt}
								onChange={setUserPrompt}
								placeholder="Describe what you'd like to change in the prompt..."
								className="text-xs"
								minHeight="min-h-[60px]"
							/>
						</div>
					</div>
				)}
			</div>
			
			{/* Кнопки управления генерацией */}
			<BaseGenerationButtons
				currentPrompt={currentPrompt}
				isGeneratingPrompt={isGeneratingPrompt}
				isStartDisabled={isStartDisabled}
				onStart={onStartPromptGeneration}
				onRegenerate={onRegeneratePrompt}
				onGenerateNew={onGenerateNew}
			/>
		</section>
	);
};

export default BaseGenerationSection;