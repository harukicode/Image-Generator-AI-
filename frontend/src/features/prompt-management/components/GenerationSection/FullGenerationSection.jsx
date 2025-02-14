import AnimatedPromptDisplay
  from '@/features/prompt-management/components/GenerationSection/ui/AnimatedPromptDisplay.jsx'
import { Button } from "@/shared/ui/button"
import { RotateCcw } from "lucide-react"
import PromptInput from "./PromptInput"
import ImageUploadDialog from '@/widgets/image-upload/ImageUploadDialog'
import ImageGenerationControls from "./ImageGenerationControls"
import ImageGenerationButtons from "./ImageGenerationButtons"
import PromptAdditionsLibrary from "@/features/prompt-management/components/presets/PromptAdditionsLibrary"
import BaseGenerationControls from "../BaseGenerationSection/BaseGenerationControls"

const FullGenerationSection = ({
                                 // Базовые пропсы
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
                                 // Дополнительные пропсы для генерации изображений
                                 numImages,
                                 setNumImages,
                                 magicPrompt,
                                 setMagicPrompt,
                                 isGeneratingImages,
                                 onGenerate,
                                  isNewPrompt,
                                 updateCurrentPrompt,
                                 resetPromptOnly
                               }) => {
  // Обработчик сброса всех настроек
  const handleReset = () => {
    setNumImages(4);
    setContextSize(20);
    setMagicPrompt('AUTO');
    setUserPrompt('');
    onReset();
  };
  
  return (
    <section className='space-y-2'>
      {/* Заголовок с загрузкой изображения и кнопкой сброса */}
      <header className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <h2 className='text-base xs:text-lg sm:text-xl font-semibold text-[#4339CA]'>
            Enter custom prompt
          </h2>
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
      
      {/* Все элементы управления */}
      <div className='flex flex-wrap items-center gap-2'>
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {/* Базовые элементы управления */}
          <BaseGenerationControls
            contextSize={contextSize}
            setContextSize={setContextSize}
            companyName={companyName}
            setCompanyName={setCompanyName}
          />
          
          {/* Элементы управления генерацией изображений */}
          <ImageGenerationControls
            numImages={numImages}
            setNumImages={setNumImages}
            magicPrompt={magicPrompt}
            setMagicPrompt={setMagicPrompt}
            setCustomPrompt={setCustomPrompt}
          />
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
      <ImageGenerationButtons
        currentPrompt={currentPrompt}
        isGeneratingPrompt={isGeneratingPrompt}
        isGeneratingImages={isGeneratingImages}
        isStartDisabled={isStartDisabled}
        onStart={onStartPromptGeneration}
        onRegenerate={onRegeneratePrompt}
        onGenerate={onGenerate}
      />
    </section>
  );
};

export default FullGenerationSection;