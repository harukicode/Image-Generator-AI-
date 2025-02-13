import GenerationButtons from "@/features/prompt-management/components/GenerationSection/GenerationButtons.jsx"
import GenerationControls from "@/features/prompt-management/components/GenerationSection/GenerationControls.jsx"
import PromptInput from "@/features/prompt-management/components/GenerationSection/PromptInput.jsx"
import PromptAdditionsLibrary from "@/features/prompt-management/components/presets/PromptAdditionsLibrary.jsx"
import { Button } from "@/shared/ui/button"
import ImageUploadDialog from '@/widgets/image-upload/ImageUploadDialog.jsx'
import { RotateCcw } from "lucide-react"

const GenerationSection = ({
                             customPrompt,
                             setCustomPrompt,
                             onStartPromptGeneration,
                             onRegeneratePrompt,
                             onGenerate,
                             currentPrompt,
                             userPrompt,
                             setUserPrompt,
                             isGeneratingPrompt,
                             isGeneratingImages,
                             isStartDisabled,
                             numImages,
                             setNumImages,
                             magicPrompt,
                             setMagicPrompt,
                             contextSize,
                             setContextSize,
                             reset: resetPrompt,
                              companyName,
                              setCompanyName,
                             uploadedImage,
                             setUploadedImage,
                             onReset,
                           }) => {
  
  const handleReset = () => {
    setNumImages(4);
    setContextSize(20);
    setMagicPrompt('AUTO');
    setUserPrompt('');
    onReset(); // This will handle image reset too
    if (resetPrompt) {
      resetPrompt();
    }
  };
  
  return (
    <section className='space-y-2'>
      <header className='flex justify-between items-center'>
        <div className='flex items-center gap-4'> {/* Increased gap from 2 to 4 */}
          <h2 className='text-base xs:text-lg sm:text-xl font-semibold text-[#4339CA]'>
            Enter custom prompt
          </h2>
          {/* Add ImageUploadDialog here */}
          <ImageUploadDialog
            setUploadedImage={setUploadedImage}
            onReset={onReset}
            uploadedImage={uploadedImage}
          />
          {/* Reset button */}
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
      
      <div className='flex flex-wrap items-center gap-2'>
        <GenerationControls
          className='flex-1 min-w-0'
          numImages={numImages}
          setNumImages={setNumImages}
          magicPrompt={magicPrompt}
          setMagicPrompt={setMagicPrompt}
          setCustomPrompt={setCustomPrompt}
          contextSize={contextSize}
          setContextSize={setContextSize}
          onReset={handleReset}
          showResetButton={false}
          companyName={companyName}
          setCompanyName={setCompanyName}
        />
      </div>
      
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
          <GeneratedPromptSection
            currentPrompt={currentPrompt}
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
          />
        )}
      </div>
      
      <GenerationButtons
        currentPrompt={currentPrompt}
        isGeneratingPrompt={isGeneratingPrompt}
        isGeneratingImages={isGeneratingImages}
        isStartDisabled={isStartDisabled}
        onStart={onStartPromptGeneration}
        onRegenerate={onRegeneratePrompt}
        onGenerate={onGenerate}
        className='scale-90'
      />
    </section>
  );
};

const GeneratedPromptSection = ({ currentPrompt, userPrompt, setUserPrompt }) => (
  <div className='space-y-1'>
    <div className='p-2 bg-gray-50 rounded-lg'>
      <h3 className='text-xs font-medium text-gray-700 mb-1'>Generated Prompt:</h3>
      <p className='text-xs text-gray-600'>{currentPrompt}</p>
    </div>
    
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
);

export default GenerationSection;