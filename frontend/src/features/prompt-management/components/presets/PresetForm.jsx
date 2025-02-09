import { Button } from '@/shared/ui/button.jsx'
import { Input } from '@/shared/ui/input.jsx'
import { useState } from 'react'
import { Save } from 'lucide-react'
import { motion } from 'framer-motion'


 const PresetForm = ({
	                        item,
	                        onSave,
	                        onCancel,
	                        isEditing = false,
	                        config
                        }) => {
	const [form, setForm] = useState(item || { [config.nameField]: '', [config.contentField]: '' });
	
	const handleSubmit = () => {
		if (!form[config.nameField] || !form[config.contentField]) return;
		onSave(form);
	};
	
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="mb-6 bg-gray-50 rounded-lg p-4 border"
		>
			<div className="space-y-4">
				<div>
					<label className="text-sm font-medium text-gray-700 mb-1 block">
						{config.nameLabel}
					</label>
					<Input
						placeholder={`Enter ${config.itemName.toLowerCase()} name...`}
						value={form[config.nameField]}
						onChange={(e) => setForm(prev => ({
							...prev,
							[config.nameField]: e.target.value
						}))}
						className="bg-white"
						autoFocus={isEditing}
					/>
				</div>
				<div>
					<label className="text-sm font-medium text-gray-700 mb-1 block">
						{config.contentLabel}
					</label>
					<textarea
						placeholder={`Enter your ${config.itemName.toLowerCase()}...`}
						value={form[config.contentField]}
						onChange={(e) => setForm(prev => ({
							...prev,
							[config.contentField]: e.target.value
						}))}
						className="w-full min-h-[120px] p-3 bg-white border rounded-lg focus:border-[#6366F1] focus:ring-[#6366F1]"
					/>
				</div>
				<div className="flex gap-2 justify-end">
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className="bg-[#6366F1] hover:bg-[#4F46E5] text-white"
					>
						<Save className="h-4 w-4 mr-2" />
						{isEditing ? `Save Changes` : `Save ${config.itemName}`}
					</Button>
				</div>
			</div>
		</motion.div>
	);
};

export default PresetForm;