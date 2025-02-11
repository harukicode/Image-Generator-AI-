import PresetLibrary from '@/features/prompt-management/components/presets/PresetLibrary.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select.jsx'
import { Input } from '@/shared/ui/input.jsx'
import { Info, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/ui/button.jsx'

const GenerationControls = ({
	                            className,
	                            numImages,
	                            setNumImages,
	                            magicPrompt,
	                            setMagicPrompt,
	                            setCustomPrompt,
	                            contextSize = 20,
	                            setContextSize,
	                            onReset
                            }) => {
	const handleReset = () => {
		setNumImages(4);
		setContextSize(20);
		setMagicPrompt('AUTO');
		setCustomPrompt('');
		if (onReset) onReset();
	};
	
	return (
		<div className={`flex flex-wrap items-center gap-3 ${className}`}>
			<Button
				variant="outline"
				size="icon"
				onClick={handleReset}
				className="w-8 h-8 flex-shrink-0"
				title="Reset all settings"
			>
				<RotateCcw className="h-4 w-4" />
			</Button>
			<NumImagesInput value={numImages} onChange={setNumImages} />
			<ContextSizeInput value={contextSize} onChange={setContextSize} />
			<MagicPromptSelect value={magicPrompt} onChange={setMagicPrompt} />
			<PresetLibrary onSelectPreset={setCustomPrompt} />
		</div>
	);
};

const NumImagesInput = ({ value, onChange }) => (
	<Input
		type="text"
		value={value}
		onChange={(e) => {
			const value = e.target.value;
			if (value === '') {
				onChange('');
				return;
			}
			
			const num = parseInt(value);
			if (!isNaN(num)) {
				onChange(num > 50 ? '50' : value);
			}
		}}
		className="w-[80px]"
		placeholder="Images"
	/>
);

const ContextSizeInput = ({ value, onChange }) => (
	<div className="relative flex items-center">
		<Input
			type="text"
			value={value}
			onChange={(e) => {
				const value = e.target.value;
				if (value === '') {
					onChange('');
					return;
				}
				
				const num = parseInt(value);
				if (!isNaN(num)) {
					onChange(Math.max(2, Math.min(500, num)));
				}
			}}
			className="w-[100px] pr-8"
			placeholder="Context"
		/>
		<div className="absolute right-2 top-1/2 -translate-y-1/2 group">
			<Info className="w-4 h-4 text-gray-400" />
			<div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
				Number of previous messages to keep in context (2-500)
			</div>
		</div>
	</div>
);

const MagicPromptSelect = ({ value, onChange }) => (
	<Select value={value} onValueChange={onChange}>
		<SelectTrigger className="w-[125px]">
			<SelectValue placeholder="Magic" />
		</SelectTrigger>
		<SelectContent>
			<SelectItem value="ON">Magic: On</SelectItem>
			<SelectItem value="OFF">Magic: Off</SelectItem>
			<SelectItem value="AUTO">Magic: Auto</SelectItem>
		</SelectContent>
	</Select>
);

export default GenerationControls;