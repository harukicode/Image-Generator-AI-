import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const LoadingView = ({ generationProgress, generatedImages }) => {
	const content = generationProgress.totalBatches <= 1
		? "Generating your images..."
		: (
			<>
				Generating batch {generationProgress.completedBatches + 1} of {generationProgress.totalBatches}
				<br/>
				{generatedImages.length} images generated so far
			</>
		);
	
	return (
		<motion.div
			key="loading"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="h-full flex flex-col items-center justify-center"
		>
			<AnimatedSpinner />
			<LoadingMessage content={content} />
		</motion.div>
	);
};

const AnimatedSpinner = () => (
	<motion.div
		animate={{ rotate: 360 }}
		transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
	>
		<Loader2 className="w-12 h-12 text-[#6366F1]" />
	</motion.div>
);

const LoadingMessage = ({ content }) => (
	<motion.p
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.2 }}
		className="text-gray-500 mt-4 text-center"
	>
		{content}
	</motion.p>
);
