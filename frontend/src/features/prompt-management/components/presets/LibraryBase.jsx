import PresetForm from '@/features/prompt-management/components/presets/PresetForm.jsx';
import ActionButtons from '@/features/prompt-management/components/presets/ui/ActionButtons.jsx';
import { Button } from '@/shared/ui/button.jsx';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog.jsx';
import { ScrollArea } from '@/shared/ui/scroll-area.jsx';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import EmptyState from './ui/EmptyState.jsx';
import { motion } from 'framer-motion';
import { usePromptsApi } from '../../hooks/usePromptsApi.js';

const LibraryBase = ({
	                     config,
	                     onSelect,
	                     buttonIcon: Icon,
                     }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [editingItem, setEditingItem] = useState(null);
	
	const {
		items,
		isLoading,
		addItem,
		updateItem,
		deleteItem
	} = usePromptsApi(config.type);
	
	const handleSelect = (item) => {
		onSelect(item[config.contentField]);
		setIsOpen(false);
	};
	
	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-4">
				<Loader2 className="w-6 h-6 animate-spin" />
			</div>
		);
	}
	
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="gap-2 bg-white hover:bg-gray-50">
					<Icon className="h-4 w-4" />
					{config.buttonText}
				</Button>
			</DialogTrigger>
			
			<DialogContent className="max-w-[600px] p-0 bg-white shadow-2xl">
				<div className="px-6 py-4 border-b flex items-center">
					<DialogTitle className="text-2xl font-semibold text-gray-900 flex-1">
						{config.title}
					</DialogTitle>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsAdding(true)}
						className="gap-2 bg-white hover:bg-gray-50 mr-8"
					>
						<Plus className="h-4 w-4" />
						Add New
					</Button>
				</div>
				
				<ScrollArea className="h-[600px] px-6 py-4">
					<AnimatePresence>
						{(isAdding || editingItem) && (
							<PresetForm
								key="form"
								item={editingItem}
								onSave={async (item) => {
									try {
										if (editingItem) {
											await updateItem({ ...item, id: editingItem.id });
											setEditingItem(null);
										} else {
											await addItem(item);
											setIsAdding(false);
										}
									} catch (error) {
										console.error('Failed to save item:', error);
									}
								}}
								onCancel={() => {
									setIsAdding(false);
									setEditingItem(null);
								}}
								isEditing={!!editingItem}
								config={config}
							/>
						)}
						
						<div key="list" className="space-y-4">
							{items.map((item) => (
								<motion.div
									key={item.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="p-4 bg-white border rounded-lg hover:border-[#6366F1]"
								>
									<div className="flex justify-between items-start mb-2">
										<h4 className="font-medium text-gray-900">
											{item[config.nameField]}
										</h4>
										<div className="flex gap-2">
											<ActionButtons
												onSelect={() => handleSelect(item)}
												onEdit={() => setEditingItem(item)}
												onDelete={async () => {
													try {
														await deleteItem(item.id);
													} catch (error) {
														console.error('Failed to delete item:', error);
													}
												}}
											/>
										</div>
									</div>
									<p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
										{item[config.contentField]}
									</p>
								</motion.div>
							))}
							
							{items.length === 0 && !isAdding && (
								<EmptyState
									icon={config.emptyIcon}
									message={config.emptyMessage}
								/>
							)}
						</div>
					</AnimatePresence>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default LibraryBase;