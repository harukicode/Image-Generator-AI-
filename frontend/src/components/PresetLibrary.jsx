import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Library, Trash2, Plus, X, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PresetLibrary = ({ onSelectPreset }) => {
	const [presets, setPresets] = useState([]);
	const [newPreset, setNewPreset] = useState({ name: "", prompt: "" });
	const [isOpen, setIsOpen] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [editingPreset, setEditingPreset] = useState(null);
	
	useEffect(() => {
		const savedPresets = localStorage.getItem("promptPresets");
		if (savedPresets) {
			setPresets(JSON.parse(savedPresets));
		}
	}, []);
	
	const savePreset = () => {
		if (!newPreset.name || !newPreset.prompt) return;
		
		const updatedPresets = [...presets, { ...newPreset, id: Date.now() }];
		setPresets(updatedPresets);
		localStorage.setItem("promptPresets", JSON.stringify(updatedPresets));
		setNewPreset({ name: "", prompt: "" });
		setIsAdding(false);
	};
	
	const updatePreset = (updatedPreset) => {
		const updatedPresets = presets.map(preset =>
			preset.id === updatedPreset.id ? updatedPreset : preset
		);
		setPresets(updatedPresets);
		localStorage.setItem("promptPresets", JSON.stringify(updatedPresets));
		setEditingPreset(null);
	};
	
	const deletePreset = (id) => {
		const updatedPresets = presets.filter(preset => preset.id !== id);
		setPresets(updatedPresets);
		localStorage.setItem("promptPresets", JSON.stringify(updatedPresets));
	};
	
	const handleSelect = (preset) => {
		onSelectPreset(preset.prompt);
		setIsOpen(false);
	};
	
	const startEditing = (preset) => {
		setEditingPreset({ ...preset });
	};
	
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="gap-2 bg-white hover:bg-gray-50">
					<Library className="h-4 w-4" />
					Prompt Presets
				</Button>
			</DialogTrigger>
			
			<DialogContent className="[&>button:first-of-type]:hidden max-w-[600px] p-0 bg-white shadow-2xl">
				<div className="px-6 py-4 border-b flex items-center">
					<DialogTitle className="text-2xl font-semibold text-gray-900 flex-1">Prompt Presets</DialogTitle>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsAdding(true)}
						className="gap-2 bg-white hover:bg-gray-50 mr-2"
					>
						<Plus className="h-4 w-4" />
						Add New
					</Button>
					<DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
						<X className=" ml-4 h-4 w-4" />
						<span className="sr-only">Close</span>
					</DialogClose>
				</div>
				
				<div className="flex flex-col h-[600px]">
					<ScrollArea className="flex-grow px-6 py-4">
						<AnimatePresence>
							{isAdding && (
								<motion.div
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									className="mb-6 bg-gray-50 rounded-lg p-4 border"
								>
									<div className="space-y-4">
										<div>
											<label className="text-sm font-medium text-gray-700 mb-1 block">
												Preset Name
											</label>
											<Input
												placeholder="Enter preset name..."
												value={newPreset.name}
												onChange={(e) => setNewPreset(prev => ({ ...prev, name: e.target.value }))}
												className="bg-white"
											/>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-700 mb-1 block">
												Prompt Template
											</label>
											<textarea
												placeholder="Enter your prompt template..."
												value={newPreset.prompt}
												onChange={(e) => setNewPreset(prev => ({ ...prev, prompt: e.target.value }))}
												className="w-full min-h-[120px] p-3 bg-white border rounded-lg focus:border-[#6366F1] focus:ring-[#6366F1]"
											/>
										</div>
										<div className="flex gap-2 justify-end">
											<Button
												variant="outline"
												onClick={() => {
													setIsAdding(false);
													setNewPreset({ name: "", prompt: "" });
												}}
											>
												Cancel
											</Button>
											<Button
												onClick={savePreset}
												className="bg-[#6366F1] hover:bg-[#4F46E5] text-white"
											>
												<Save className="h-4 w-4 mr-2" />
												Save Preset
											</Button>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
						
						<div className="space-y-4">
							{presets.map((preset) => (
								<motion.div
									key={preset.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
									className="p-4 bg-white border rounded-lg hover:border-[#6366F1] transition-colors duration-200"
								>
									<AnimatePresence mode="wait">
										{editingPreset?.id === preset.id ? (
											<motion.div
												key="editing"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												className="space-y-4"
											>
												<Input
													value={editingPreset.name}
													onChange={(e) => setEditingPreset(prev => ({ ...prev, name: e.target.value }))}
													className="font-medium text-gray-900"
													autoFocus
												/>
												<motion.textarea
													initial={{ height: 0 }}
													animate={{ height: "auto" }}
													value={editingPreset.prompt}
													onChange={(e) => setEditingPreset(prev => ({ ...prev, prompt: e.target.value }))}
													className="w-full min-h-[120px] p-3 bg-gray-50 border rounded-lg focus:border-[#6366F1] focus:ring-[#6366F1]"
												/>
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 0.1 }}
													className="flex gap-2 justify-end"
												>
													<Button
														variant="outline"
														size="sm"
														onClick={() => setEditingPreset(null)}
													>
														Cancel
													</Button>
													<Button
														size="sm"
														onClick={() => updatePreset(editingPreset)}
														className="bg-[#6366F1] hover:bg-[#4F46E5] text-white"
													>
														<Save className="h-4 w-4 mr-2" />
														Save Changes
													</Button>
												</motion.div>
											</motion.div>
										) : (
											<motion.div
												key="viewing"
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 10 }}
												transition={{ duration: 0.2 }}
											>
												<div className="flex justify-between items-start mb-2">
													<h4 className="font-medium text-gray-900">{preset.name}</h4>
													<div className="flex gap-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleSelect(preset)}
															className="text-[#6366F1] hover:text-[#4F46E5] hover:bg-[#6366F1]/10"
														>
															Use
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => startEditing(preset)}
															className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => deletePreset(preset.id)}
															className="text-red-600 hover:text-red-700 hover:bg-red-50"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
												<motion.p
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md"
												>
													{preset.prompt}
												</motion.p>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							))}
							
							{presets.length === 0 && !isAdding && (
								<div className="text-center py-8 text-gray-500">
									<Library className="h-12 w-12 mx-auto mb-3 opacity-50" />
									<p>No presets yet. Click "Add New" to create your first preset.</p>
								</div>
							)}
						</div>
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PresetLibrary;