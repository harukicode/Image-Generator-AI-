import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedPromptDisplay = ({ prompt, isNew = false }) => {
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
				<h3 className="text-xs font-medium text-gray-700 mb-1">
					Generated Prompt:
				</h3>
				<p className="text-xs text-gray-600">{prompt}</p>
			</motion.div>
		</AnimatePresence>
	);
};

export default AnimatedPromptDisplay;