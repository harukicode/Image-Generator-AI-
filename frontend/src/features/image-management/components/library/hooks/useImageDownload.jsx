import { useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import axios from "axios";

export const useImageDownload = () => {
	const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
	const [imageToDownload, setImageToDownload] = useState(null);
	const { toast } = useToast();
	
	const downloadImage = async (image, companyName) => {
		try {
			const response = await axios({
				url: `http://localhost:3000/generated/${image.filename}`,
				method: 'GET',
				responseType: 'blob',
			});
			
			const fileIndex = image.filename.match(/\d{2}\.png$/)[0];
			const newFilename = `${companyName}-${fileIndex}`;
			
			const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.setAttribute('download', newFilename);
			
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
			
			toast({
				title: "Success",
				description: "Image downloaded successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to download image",
				variant: "destructive",
			});
		}
	};
	
	return {
		isDownloadDialogOpen,
		setIsDownloadDialogOpen,
		imageToDownload,
		setImageToDownload,
		downloadImage,
	};
};