import { useState, useEffect } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import axios from "axios";

export const useImageLibrary = (apiEndpoint) => {
	const [images, setImages] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();
	
	useEffect(() => {
		fetchImages();
	}, []);
	
	const fetchImages = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(apiEndpoint);
			setImages(response.data.images);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch images",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};
	
	const deleteImage = async (image) => {
		try {
			await axios.delete(`${apiEndpoint}/${image.filename}`);
			setImages(prevImages => prevImages.filter(img => img.id !== image.id));
			toast({
				title: "Success",
				description: "Image deleted successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: error.response?.data?.error || "Failed to delete image",
				variant: "destructive",
			});
			
			if (error.response?.status === 404) {
				setImages(prevImages => prevImages.filter(img => img.id !== image.id));
			}
		}
	};
	
	const handleImageUpload = async (event) => {
		const file = event.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append("image", file);
			
			try {
				await axios.post("http://localhost:3000/api/upload", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				// После успешной загрузки обновляем список изображений
				await fetchImages();
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to upload image",
					variant: "destructive",
				});
			}
		}
	};
	
	return {
		images,
		deleteImage,
		handleImageUpload,
		fetchImages,
	};
};