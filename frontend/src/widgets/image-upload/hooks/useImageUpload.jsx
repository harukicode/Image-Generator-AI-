import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export const useImageUpload = ({ onUpload, onReset }) => {
	const [preview, setPreview] = useState(null);
	const [isDragActive, setIsDragActive] = useState(false);
	
	const handleUpload = async (file) => {
		const formData = new FormData();
		formData.append("image", file);
		
		try {
			const response = await axios.post(
				"http://localhost:3000/api/upload",
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);
			setPreview(`http://localhost:3000${response.data.imageUrl}`);
			onUpload(file);
		} catch (error) {
			console.error("Failed to upload image:", error);
		}
	};
	
	const handleSelectFromLibrary = async (imageUrl) => {
		onReset();
		setPreview(imageUrl);
		try {
			const response = await axios.get(imageUrl, { responseType: "blob" });
			const file = new File([response.data], "selected_image.jpg", { type: "image/jpeg" });
			onUpload(file);
		} catch (error) {
			console.error("Failed to fetch selected image:", error);
		}
	};
	
	const resetImage = () => {
		setPreview(null);
		onUpload(null);
		onReset();
	};
	
	const {
		getRootProps,
		getInputProps,
		isDragActive: isDropzoneDragActive,
	} = useDropzone({
		onDrop: async ([file]) => handleUpload(file),
		onDragEnter: () => setIsDragActive(true),
		onDragLeave: () => setIsDragActive(false),
		onDropRejected: () => setIsDragActive(false),
	});
	
	useEffect(() => {
		setIsDragActive(isDropzoneDragActive);
	}, [isDropzoneDragActive]);
	
	return {
		preview,
		isDragActive,
		getRootProps,
		getInputProps,
		handleSelectFromLibrary,
		resetImage,
	};
};