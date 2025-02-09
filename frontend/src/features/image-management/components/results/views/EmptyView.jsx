import { motion } from "framer-motion";

export const EmptyView = () => (
	<motion.div
		key="empty"
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="h-full flex items-center justify-center"
	>
		<p className="text-gray-400 text-lg">
			Generated images will appear here
		</p>
	</motion.div>
);
