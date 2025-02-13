import PresetLibrary from '@/features/prompt-management/components/presets/PresetLibrary.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select.jsx'
import { Input } from '@/shared/ui/input.jsx'
import { Info } from 'lucide-react'

const GenerationControls = ({
	                            className,
	                            numImages,
	                            setNumImages,
	                            magicPrompt,
	                            setMagicPrompt,
	                            setCustomPrompt,
	                            contextSize = 20,
	                            setContextSize,
                            }) => {
	return (
		<div className={`flex flex-wrap items-center gap-2 ${className}`}>
			<div className="flex items-center gap-2 min-w-0">
				<Input
					type="text"
					placeholder="Company name"
					className="w-[140px]"
				/>
				<NumImagesInput value={numImages} onChange={setNumImages} />
				<ContextSizeInput value={contextSize} onChange={setContextSize} />
				<MagicPromptSelect value={magicPrompt} onChange={setMagicPrompt} />
				<PresetLibrary onSelectPreset={setCustomPrompt} />
			</div>
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
		className="w-[60px]"
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
			className="w-[70px] pr-7"
			placeholder="Context"
		/>
		<div className="absolute right-2 top-1/2 -translate-y-1/2 group">
			<Info className="w-3 h-3 text-gray-400" />
			<div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
				Number of previous messages to keep in context (2-500)
			</div>
		</div>
	</div>
);

const MagicPromptSelect = ({ value, onChange }) => (
	<Select value={value} onValueChange={onChange}>
		<SelectTrigger className="w-[100px]">
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