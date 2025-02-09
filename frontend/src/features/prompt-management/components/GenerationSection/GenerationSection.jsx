import GenerationButtons from '@/features/prompt-management/components/GenerationSection/GenerationButtons.jsx'
import GenerationControls from '@/features/prompt-management/components/GenerationSection/GenerationControls.jsx'
import PromptInput from '@/features/prompt-management/components/GenerationSection/PromptInput.jsx'
import PromptAdditionsLibrary from '@/features/prompt-management/components/presets/PromptAdditionsLibrary.jsx'

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
                             setMagicPrompt
                           }) => {
  return (
    <section className="space-y-4">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#4339CA]">
          Enter custom prompt
        </h2>
        <GenerationControls
          numImages={numImages}
          setNumImages={setNumImages}
          magicPrompt={magicPrompt}
          setMagicPrompt={setMagicPrompt}
          setCustomPrompt={setCustomPrompt}
        />
      </header>
      
      <div className="space-y-4">
        <PromptInput
          value={customPrompt}
          onChange={setCustomPrompt}
          label="Custom prompt"
          placeholder="Enter your custom prompt..."
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
      />
    </section>
  );
};

const GeneratedPromptSection = ({ currentPrompt, userPrompt, setUserPrompt }) => (
  <div className="mt-6 space-y-4">
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Generated Prompt:</h3>
      <p className="text-gray-600">{currentPrompt}</p>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Customize prompt or provide feedback
        </label>
        <PromptAdditionsLibrary onSelectAddition={setUserPrompt} />
      </div>
      <PromptInput
        value={userPrompt}
        onChange={setUserPrompt}
        placeholder="Describe what you'd like to change in the prompt..."
      />
    </div>
  </div>
);

export default GenerationSection;