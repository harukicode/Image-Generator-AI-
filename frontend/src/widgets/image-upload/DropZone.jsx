import { motion } from "framer-motion";
import { Upload } from "lucide-react";

export const DropZone = ({ preview, isDragActive, rootProps, inputProps }) => (
	<motion.div
		className={`flex-grow border-2 border-dashed rounded-lg p-8 text-center
      cursor-pointer transition-colors duration-300
      ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
		whileHover={{ scale: 1.01 }}
		whileTap={{ scale: 0.99 }}
		{...rootProps}
	>
		<input {...inputProps} />
		{preview ? (
			<ImagePreview src={preview} />
		) : (
			<UploadPrompt />
		)}
	</motion.div>
);

const ImagePreview = ({ src }) => (
	<img
		src={src || "/placeholder.svg"}
		alt="Preview"
		className="max-w-[300px] max-h-[300px] mx-auto rounded-lg"
	/>
);

const UploadPrompt = () => (
	<div className="flex flex-col items-center">
		<Upload className="h-12 w-12 text-gray-400 mb-2" />
		<p className="text-gray-600">Drag and drop or click to upload</p>
	</div>
);