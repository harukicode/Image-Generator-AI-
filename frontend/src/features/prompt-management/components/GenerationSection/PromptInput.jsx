import { motion } from "framer-motion";


const PromptInput = ({ value, onChange, label, placeholder }) => (
	<motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
		<textarea
			placeholder={placeholder}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className="w-full min-h-[100px] p-3 border rounded-lg focus:border-[#6366F1] focus:ring-[#6366F1]"
		/>
	</motion.div>
);

export default PromptInput;