import { motion } from "framer-motion";

export const ErrorView = ({ error }) => (
	<motion.div
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg"
	>
		{error}
	</motion.div>
);