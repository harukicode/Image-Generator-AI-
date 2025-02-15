import { Button } from '@/shared/ui/button'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const BaseGenerationButtons = ({
	                               currentPrompt,
	                               isGeneratingPrompt,
	                               isStartDisabled,
	                               onStart,
	                               onRegenerate,
			                               onGenerateNew,
                               }) => (
	<div className="space-y-2">
		{!currentPrompt ? (
			<StartButton onClick={onStart} disabled={isStartDisabled || isGeneratingPrompt} isLoading={isGeneratingPrompt} />
		) : (
			<div className="flex gap-2 flex-wrap">
				<GenerateNewButton onClick={onGenerateNew} disabled={isGeneratingPrompt} isLoading={isGeneratingPrompt} />
				<RegenerateButton onClick={onRegenerate} disabled={isGeneratingPrompt} isLoading={isGeneratingPrompt} />
			</div>
		)}
	</div>
)

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


const GenerateNewButton = ({ onClick, disabled, isLoading }) => (
	<motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
		<Button onClick={onClick} disabled={disabled} variant="outline" className="w-full">
			{isLoading && <LoadingSpinner />}
			Generate New Prompt
		</Button>
	</motion.div>
)

const RegenerateButton = ({ onClick, disabled, isLoading }) => (
	<motion.div className='flex-1' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
		<Button
			onClick={onClick}
			disabled={disabled}
			variant='outline'
			className=' w-full'
		>
			{isLoading && <LoadingSpinner />}
			Regenerate Prompt
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

export default BaseGenerationButtons;