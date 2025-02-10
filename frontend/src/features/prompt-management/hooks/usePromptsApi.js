import { useState, useEffect, useCallback } from 'react';
import { promptsApi } from '../api/prompts.api';
import { useToast } from '@/shared/hooks/use-toast';

export const usePromptsApi = (type = 'presets') => {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();
	
	const api = type === 'presets' ? {
		getAll: promptsApi.getAllPresets,
		create: promptsApi.createPreset,
		update: promptsApi.updatePreset,
		delete: promptsApi.deletePreset
	} : {
		getAll: promptsApi.getAllAdditions,
		create: promptsApi.createAddition,
		update: promptsApi.updateAddition,
		delete: promptsApi.deleteAddition
	};
	
	const fetchItems = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await api.getAll();
			if (response.success) {
				setItems(response.data[type] || []);
			} else {
				throw new Error(response.error);
			}
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [type, toast]);
	
	useEffect(() => {
		fetchItems();
	}, [fetchItems]);
	
	const addItem = useCallback(async (item) => {
		try {
			const response = await api.create(item);
			if (response.success) {
				setItems(prev => [...prev, response.data[type === 'presets' ? 'preset' : 'addition']]);
				toast({
					title: "Success",
					description: "Item created successfully",
				});
				return response.data[type === 'presets' ? 'preset' : 'addition'];
			}
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
			throw error;
		}
	}, [type, toast]);
	
	const updateItem = useCallback(async (item) => {
		try {
			const response = await api.update(item.id, item);
			if (response.success) {
				setItems(prev =>
					prev.map(i => i.id === item.id ?
						response.data[type === 'presets' ? 'preset' : 'addition'] : i
					)
				);
				toast({
					title: "Success",
					description: "Item updated successfully",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
			throw error;
		}
	}, [type, toast]);
	
	const deleteItem = useCallback(async (id) => {
		try {
			const response = await api.delete(id);
			if (response.success) {
				setItems(prev => prev.filter(item => item.id !== id));
				toast({
					title: "Success",
					description: "Item deleted successfully",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
			throw error;
		}
	}, [toast]);
	
	return {
		items,
		isLoading,
		addItem,
		updateItem,
		deleteItem,
		refreshItems: fetchItems
	};
};