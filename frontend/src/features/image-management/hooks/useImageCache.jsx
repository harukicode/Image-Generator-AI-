import { useState, useEffect, useRef } from 'react';

export const useImageCache = (images) => {
	const imageCache = useRef(new Map());
	const [loadedImages, setLoadedImages] = useState(new Set());
	
	const preloadImage = async (url) => {
		if (loadedImages.has(url)) return;
		
		return new Promise((resolve) => {
			const img = new Image();
			img.src = `http://localhost:3000${url}`;
			imageCache.current.set(url, img);
			
			img.onload = () => {
				setLoadedImages(prev => new Set(prev).add(url));
				resolve();
			};
			
			img.onerror = () => {
				imageCache.current.delete(url);
				resolve();
			};
		});
	};
	
	const preloadImages = async (urls) => {
		const immediate = urls.slice(0, 4);
		await Promise.all(immediate.map(preloadImage));
		
		const remaining = urls.slice(4);
		remaining.forEach(preloadImage);
	};
	
	const getCachedImage = (url) => {
		const cached = imageCache.current.get(url);
		if (cached) {
			return cached.src;
		}
		return `http://localhost:3000${url}`;
	};
	
	useEffect(() => {
		return () => {
			imageCache.current.clear();
			setLoadedImages(new Set());
		};
	}, []);
	
	return {
		preloadImages,
		getCachedImage,
		isImageLoaded: (url) => loadedImages.has(url)
	};
};