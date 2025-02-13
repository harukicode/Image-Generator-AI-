import { useImageContext } from '@/features/image-management/components/ui/ImageContext.jsx'
import { useToast } from '@/shared/hooks/use-toast.js'
import { ToastAction } from '@/shared/ui/toast.jsx'
import axios from 'axios'
import { useRef, useState } from 'react'

export const useDeleteImage = () => {
	const { toast } = useToast();
	const [deletingImages, setDeletingImages] = useState(new Map());
	const deleteTimeoutsRef = useRef(new Map());
	const { markImageAsDeleted, isImageDeleted } = useImageContext();
	
	const getImageDetails = (image) => {
		let id;
		let filename;
		
		if (typeof image === 'number') {
			id = image.toString();
			filename = image.toString();
		}
		else if (typeof image === 'string') {
			const parts = image.split('/');
			filename = parts[parts.length - 1];
			id = filename;
		} else if (typeof image === 'object' && image !== null) {
			filename = image.filename || image.id;
			id = image.id || filename;
		} else {
			console.error('Invalid image format:', image);
			return { id: null, filename: null };
		}
		
		return {
			id: id?.toString(),
			filename: filename?.toString()
		};
	};
	
	const deleteImage = async (image, onSuccess) => {
		try {
			const { id, filename } = getImageDetails(image);
			
			if (isImageDeleted(filename)) {
				console.log('Image already deleted:', filename);
				onSuccess?.();
				return;
			}
			
			const performDelete = async () => {
				try {
					const endpoint = `http://localhost:3000/api/generated-images/${filename}`;
					const response = await axios.delete(endpoint);
					
					if (response.data?.success) {
						markImageAsDeleted(filename);
						onSuccess?.();
						toast({
							title: "Success",
							description: "Image deleted successfully",
						});
					} else {
						throw new Error(response.data?.error || 'Failed to delete image');
					}
				} catch (error) {
					console.error('Delete request failed:', error);
					
					const errorMessage = error.response?.status === 404
						? `Image "${filename}" not found or already deleted`
						: "Failed to delete image";
					
					toast({
						title: "Error",
						description: errorMessage,
						variant: "destructive",
					});
				} finally {
					// Clean up our tracking maps
					deleteTimeoutsRef.current.delete(id);
					setDeletingImages(prev => {
						const newMap = new Map(prev);
						newMap.delete(id);
						return newMap;
					});
				}
			};
			
			// Set up the deletion timeout
			const timeoutId = setTimeout(performDelete, 5000);
			
			// Store the timeout information
			deleteTimeoutsRef.current.set(id, {
				timeoutId,
				image,
				onSuccess
			});
			
			// Update the UI state
			setDeletingImages(prev => {
				const newMap = new Map(prev);
				newMap.set(id, true);
				return newMap;
			});
			
			// Show the deletion toast
			toast({
				title: "Deleting image...",
				description: "The image will be deleted in 5 seconds",
				action: (
					<ToastAction
						altText="Undo"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							undoDelete(id);
						}}
						className="bg-white hover:bg-gray-100"
					>
						Undo
					</ToastAction>
				),
				duration: 5000,
			});
			
		} catch (error) {
			console.error('Error initiating delete process:', error);
			toast({
				title: "Error",
				description: "Failed to process deletion request",
				variant: "destructive",
			});
		}
	};
	
	const undoDelete = (imageId) => {
		console.log('Attempting to undo deletion for:', imageId);
		const timeoutData = deleteTimeoutsRef.current.get(imageId);
		
		if (timeoutData) {
			console.log('Found timeout data, cancelling deletion');
			clearTimeout(timeoutData.timeoutId);
			deleteTimeoutsRef.current.delete(imageId);
			
			setDeletingImages(prev => {
				const newMap = new Map(prev);
				newMap.delete(imageId);
				return newMap;
			});
			
			toast({
				title: "Deletion cancelled",
				description: "The image will not be deleted",
				variant: "default",
			});
		} else {
			console.log('No timeout data found for:', imageId);
		}
	};
	
	const isDeleting = (image) => {
		try {
			const { id } = getImageDetails(image);
			return id ? deletingImages.has(id) : false;
		} catch (error) {
			console.error('Error checking deletion status:', error);
			return false;
		}
	};
	
	return {
		deleteImage,
		isDeleting,
	};
};