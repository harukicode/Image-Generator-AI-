import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export function ImageProvider({ children }) {
	const [deletedImages, setDeletedImages] = useState(new Set());
	
	const markImageAsDeleted = (filename) => {
		setDeletedImages(prev => new Set([...prev, filename]));
	};
	
	const isImageDeleted = (filename) => {
		return deletedImages.has(filename);
	};
	
	return (
		<ImageContext.Provider value={{ markImageAsDeleted, isImageDeleted }}>
			{children}
		</ImageContext.Provider>
	);
}

export const useImageContext = () => useContext(ImageContext);