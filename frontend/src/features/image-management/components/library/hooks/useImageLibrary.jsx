import { useState, useEffect } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import axios from "axios";

export const useImageLibrary = (apiEndpoint) => {
	const [images, setImages] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const { toast } = useToast();
	
	const fetchImages = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await axios.get(apiEndpoint);
			
			if (response.data.success) {
				setImages(response.data.data.images || []);
			} else {
				throw new Error(response.data.error || 'Failed to fetch images');
			}
		} catch (error) {
			console.error('Error fetching images:', error);
			setError(error.message);
			toast({
				title: "Error",
				description: "Failed to fetch images",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};
	
	useEffect(() => {
		fetchImages();
	}, []);
	
	const deleteImage = async (image) => {
		try {
			await axios.delete(`${apiEndpoint}/${image.filename}`);
			setImages(prevImages => prevImages.filter(img => img.id !== image.id));
			toast({
				title: "Success",
				description: "Image deleted successfully",
			});
		} catch (error) {
			console.error('Error deleting image:', error);
			toast({
				title: "Error",
				description: error.response?.data?.error || "Failed to delete image",
				variant: "destructive",
			});
		}
	};
	
	const handleImageUpload = async (event) => {
		const file = event.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append("image", file);
			
			try {
				const response = await axios.post(
					"http://localhost:3000/api/upload",
					formData,
					{
						headers: { "Content-Type": "multipart/form-data" },
					}
				);
				
				if (response.data.success) {
					await fetchImages();
					toast({
						title: "Success",
						description: "Image uploaded successfully",
					});
				} else {
					throw new Error(response.data.error || 'Upload failed');
				}
			} catch (error) {
				console.error('Error uploading image:', error);
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
		isLoading,
		error,
		deleteImage,
		handleImageUpload,
		fetchImages,
	};
};