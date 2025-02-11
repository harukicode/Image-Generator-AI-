import GenerationButtons from "@/features/prompt-management/components/GenerationSection/GenerationButtons.jsx"
import GenerationControls from "@/features/prompt-management/components/GenerationSection/GenerationControls.jsx"
import PromptInput from "@/features/prompt-management/components/GenerationSection/PromptInput.jsx"
import PromptAdditionsLibrary from "@/features/prompt-management/components/presets/PromptAdditionsLibrary.jsx"

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
                           }) => {
  const handleReset = () => {
    setCustomPrompt('');
    setUserPrompt('');
    if (resetPrompt) {
      resetPrompt();
    }
  };
  
  return (
    <section className="space-y-2 sm:space-y-3 md:space-y-4">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#4339CA]">Enter custom prompt</h2>
        <GenerationControls
          className="w-full sm:w-auto scale-90 sm:scale-100"
          numImages={numImages}
          setNumImages={setNumImages}
          magicPrompt={magicPrompt}
          setMagicPrompt={setMagicPrompt}
          setCustomPrompt={setCustomPrompt}
          contextSize={contextSize}
          setContextSize={setContextSize}
          onReset={handleReset}
        />
      </header>
      
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <PromptInput
          value={customPrompt}
          onChange={setCustomPrompt}
          label="Custom prompt"
          placeholder="Enter your custom prompt..."
          className="text-sm sm:text-base"
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
        className="scale-90 sm:scale-100"
      />
    </section>
  );
};

const GeneratedPromptSection = ({ currentPrompt, userPrompt, setUserPrompt }) => (
  <div className="space-y-1 sm:space-y-2">
    <div className="p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg">
      <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Generated Prompt:</h3>
      <p className="text-xs sm:text-sm text-gray-600">{currentPrompt}</p>
    </div>
    
    <div className="space-y-1 sm:space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs sm:text-sm font-medium text-gray-700">
          Customize prompt or provide feedback
        </label>
        <PromptAdditionsLibrary
          onSelectAddition={setUserPrompt}
          className="scale-90 sm:scale-100"
        />
      </div>
      <PromptInput
        value={userPrompt}
        onChange={setUserPrompt}
        placeholder="Describe what you'd like to change in the prompt..."
        className="text-xs sm:text-sm"
      />
    </div>
  </div>
);

export default GenerationSection;