import PresetLibrary from '@/features/prompt-management/components/presets/PresetLibrary.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select.jsx'
import { Input } from '@/shared/ui/input.jsx'

const GenerationControls = ({ numImages, setNumImages, magicPrompt, setMagicPrompt, setCustomPrompt }) => (
	<div className="flex items-center gap-3">
		<NumImagesInput value={numImages} onChange={setNumImages} />
		<MagicPromptSelect value={magicPrompt} onChange={setMagicPrompt} />
		<PresetLibrary onSelectPreset={setCustomPrompt} />
	</div>
);

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