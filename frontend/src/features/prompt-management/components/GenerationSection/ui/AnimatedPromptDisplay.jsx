import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { Button } from "@/shared/ui/button";

const AnimatedPromptDisplay = ({ prompt, isNew = false, onPromptEdit }) => {
	const [shouldAnimate, setShouldAnimate] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedPrompt, setEditedPrompt] = useState(prompt);
	const [animationState, setAnimationState] = useState('initial'); // 'initial', 'glowing', 'fading'
	
	useEffect(() => {
		let glowTimer;
		let fadeTimer;
		
		if (isNew) {
			setAnimationState('glowing');
			
			glowTimer = setTimeout(() => {
				setAnimationState('fading');
			}, 2000);
			
			fadeTimer = setTimeout(() => {
				setAnimationState('initial');
			}, 3200);
		} else {
			setAnimationState('initial');
		}
		
		return () => {
			if (glowTimer) clearTimeout(glowTimer);
			if (fadeTimer) clearTimeout(fadeTimer);
		};
	}, [isNew]);
	
	const getGlowStyle = () => {
		switch (animationState) {
			case 'glowing':
				return '0 0 15px 1px rgba(34, 197, 94, 0.5)';
			case 'fading':
				return '0 0 15px 1px rgba(34, 197, 94, 0)';
			default:
				return '0 0 0 0 rgba(34, 197, 94, 0)';
		}
	};
	
	useEffect(() => {
		setEditedPrompt(prompt);
	}, [prompt]);
	
	const handleEdit = () => {
		setIsEditing(true);
	};
	
	const handleSave = () => {
		onPromptEdit?.(editedPrompt);
		setIsEditing(false);
	};
	
	const handleCancel = () => {
		setEditedPrompt(prompt);
		setIsEditing(false);
	};
	
	return (
		<AnimatePresence>
			<motion.div
				className="p-2 rounded-lg bg-gray-50"
				animate={{
					boxShadow: getGlowStyle()
				}}
				initial={{
					boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)'
				}}
				transition={{
					duration: 1.2,
					ease: [0.4, 0, 0.2, 1]
				}}
			>
				<div className="flex justify-between items-start gap-2">
					<h3 className="text-xs font-medium text-gray-700 mb-1">
						Generated Prompt:
					</h3>
					{!isEditing && (
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6 hover:bg-gray-100"
							onClick={handleEdit}
						>
							<Pencil className="h-3.5 w-3.5 text-gray-500" />
						</Button>
					)}
				</div>
				
				{isEditing ? (
					<div className="space-y-2">
            <textarea
	            value={editedPrompt}
	            onChange={(e) => setEditedPrompt(e.target.value)}
	            className="w-full min-h-[80px] p-2 text-xs text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleCancel}
								className="h-7 px-2 text-xs"
							>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={handleSave}
								className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
							>
								Save
							</Button>
						</div>
					</div>
				) : (
					<p className="text-xs text-gray-600">{editedPrompt}</p>
				)}
			</motion.div>
		</AnimatePresence>
	);
};

export default AnimatedPromptDisplay;