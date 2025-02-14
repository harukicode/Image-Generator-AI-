import { Button } from '@/shared/ui/button'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const ImageGenerationButtons = ({
	                                currentPrompt,
	                                isGeneratingPrompt,
	                                isGeneratingImages,
	                                isStartDisabled,
	                                onStart,
	                                onRegenerate,
	                                onGenerate,
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

// Компоненты кнопок из базового компонента
const StartButton = ({ onClick, disabled, isLoading }) => (
	<motion.div
		whileHover={!disabled ? { scale: 1.02 } : {}}
		whileTap={!disabled ? { scale: 0.98 } : {}}
	>
		<Button
			onClick={onClick}
			disabled={disabled}
			className={`w-full text-white transition-all duration-300 ${
				disabled ? "bg-gray-300" : "bg-[#6366F1] hover:bg-[#4F46E5] hover:shadow-lg"
			}`}
		>
			{isLoading && <LoadingSpinner />}
			{isLoading ? "Generating Prompt..." : "Start"}
		</Button>
	</motion.div>
);

const RegenerateButton = ({ onClick, disabled, isLoading }) => (
	<motion.div
		className="flex-1"
		whileHover={{ scale: 1.02 }}
		whileTap={{ scale: 0.98 }}
	>
		<Button
			onClick={onClick}
			disabled={disabled}
			variant="outline"
			className="w-full"
		>
			{isLoading && <LoadingSpinner />}
			Regenerate Prompt
		</Button>
	</motion.div>
);

const GenerateButton = ({ onClick, disabled, isLoading }) => (
	<motion.div
		className="flex-1"
		whileHover={{ scale: 1.02 }}
		whileTap={{ scale: 0.98 }}
	>
		<Button
			onClick={onClick}
			disabled={disabled}
			className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white"
		>
			{isLoading && <LoadingSpinner />}
			{isLoading ? "Generating Images..." : "Generate Images"}
		</Button>
	</motion.div>
);

const LoadingSpinner = () => (
	<motion.div
		animate={{ rotate: 360 }}
		transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
		className="mr-2"
	>
		<Loader2 className="w-5 h-5" />
	</motion.div>
);

export default ImageGenerationButtons;