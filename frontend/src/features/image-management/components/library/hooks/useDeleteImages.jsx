import { useState, useRef } from 'react';
import { useToast } from "@/shared/hooks/use-toast";
import { ToastAction } from "@/shared/ui/toast";
import axios from "axios";

export const useDeleteImage = () => {
	const { toast } = useToast();
	const [deletingImages, setDeletingImages] = useState(new Map());
	const deleteTimeoutsRef = useRef(new Map());
	
	const getImageId = (image) => {
		if (typeof image === 'string') return image;
		if (image?.id) return image.id;
		if (image?.filename) return image.filename;
		return image;
	};
	
	const deleteImage = async (image, onSuccess) => {
		const imageId = getImageId(image);
		console.log('Deleting image with ID:', imageId);
		
		// Создаем таймер удаления
		const timeoutId = setTimeout(async () => {
			try {
				const endpoint = image.hasOwnProperty('company_name')
					? `http://localhost:3000/api/generated-images/${image.filename}`
					: `http://localhost:3000/api/generated-images/${image}`;
				
				await axios.delete(endpoint);
				onSuccess?.();
				
				toast({
					title: "Image deleted",
					description: "The image has been permanently deleted",
				});
			} catch (error) {
				console.error('Error deleting image:', error);
				toast({
					title: "Error",
					description: "Failed to delete image",
					variant: "destructive",
				});
			} finally {
				deleteTimeoutsRef.current.delete(imageId);
				setDeletingImages(prev => {
					const newMap = new Map(prev);
					newMap.delete(imageId);
					return newMap;
				});
			}
		}, 5000);
		
		// Сохраняем информацию о таймере
		deleteTimeoutsRef.current.set(imageId, {
			timeoutId,
			image,
			onSuccess
		});
		
		// Обновляем состояние удаляемых изображений
		setDeletingImages(prev => {
			const newMap = new Map(prev);
			newMap.set(imageId, true);
			return newMap;
		});
		
		// Показываем уведомление
		toast({
			title: "Deleting image...",
			description: "The image will be deleted in 5 seconds",
			action: (
				<ToastAction
					altText="Undo"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						undoDelete(imageId);
					}}
					className="bg-white hover:bg-gray-100"
				>
					Undo
				</ToastAction>
			),
			duration: 5000,
		});
	};
	
	const undoDelete = (imageId) => {
		console.log('Attempting to undo delete for image:', imageId);
		const timeoutData = deleteTimeoutsRef.current.get(imageId);
		
		if (timeoutData) {
			console.log('Found timeout data, clearing timeout');
			clearTimeout(timeoutData.timeoutId);
			deleteTimeoutsRef.current.delete(imageId);
			
			setDeletingImages(prev => {
				const newMap = new Map(prev);
				newMap.delete(imageId);
				return newMap;
			});
			
			toast({
				title: "Deletion canceled",
				description: "The image will not be deleted",
				variant: "default",
			});
		} else {
			console.log('No timeout data found for image:', imageId);
		}
	};
	
	const isDeleting = (image) => {
		const imageId = getImageId(image);
		return deletingImages.has(imageId);
	};
	
	return {
		deleteImage,
		isDeleting,
	};
};