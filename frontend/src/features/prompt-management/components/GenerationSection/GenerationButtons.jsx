import { StartButton, RegenerateButton, GenerateButton } from './ui/buttons.jsx';


const GenerationButtons = ({
	                           currentPrompt,
	                           isGeneratingPrompt,
	                           isGeneratingImages,
	                           isStartDisabled,
	                           onStart,
	                           onRegenerate,
	                           onGenerate
                           }) => (
	<div className="space-y-2">
		{!currentPrompt ? (
			<StartButton
				onClick={onStart}
				disabled={isStartDisabled || isGeneratingPrompt}
				isLoading={isGeneratingPrompt}
			/>
		) : (
			<div className="flex gap-2">
				<RegenerateButton
					onClick={onRegenerate}
					disabled={isGeneratingPrompt}
					isLoading={isGeneratingPrompt}
				/>
				<GenerateButton
					onClick={onGenerate}
					disabled={isGeneratingImages}
					isLoading={isGeneratingImages}
				/>
			</div>
		)}
	</div>
);

export default GenerationButtons;