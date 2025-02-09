import { useCallback, useEffect, useState } from 'react'

export const useLocalStorage = (storageKey, defaultValue = []) => {
	const [items, setItems] = useState(() => {
		// Инициализируем состояние сразу из localStorage
		const savedItems = localStorage.getItem(storageKey);
		return savedItems ? JSON.parse(savedItems) : defaultValue;
	});
	
	// Синхронизируем с localStorage при изменении items
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(items));
	}, [storageKey, items]);
	
	const addItem = useCallback((item) => {
		const newItem = { ...item, id: Date.now() };
		setItems(prevItems => [...prevItems, newItem]);
		return newItem;
	}, []);
	
	const updateItem = useCallback((updatedItem) => {
		setItems(prevItems =>
			prevItems.map(item =>
				item.id === updatedItem.id ? updatedItem : item
			)
		);
	}, []);
	
	const deleteItem = useCallback((id) => {
		setItems(prevItems =>
			prevItems.filter(item => item.id !== id)
		);
	}, []);
	
	return {
		items,
		addItem,
		updateItem,
		deleteItem,
	};
};