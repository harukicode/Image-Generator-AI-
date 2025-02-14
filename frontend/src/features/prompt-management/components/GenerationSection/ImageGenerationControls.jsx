import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Input } from '@/shared/ui/input'
import PresetLibrary from '@/features/prompt-management/components/presets/PresetLibrary'

const ImageGenerationControls = ({
	                                 numImages,
	                                 setNumImages,
	                                 magicPrompt,
	                                 setMagicPrompt,
	                                 setCustomPrompt,
                                 }) => {
	return (
		<div className="flex items-center gap-1.5 min-w-0">
			{/* Контроль количества изображений */}
			<NumImagesInput value={numImages} onChange={setNumImages} />
			
			{/* Выбор режима Magic Prompt */}
			<MagicPromptSelect value={magicPrompt} onChange={setMagicPrompt} />
			
			{/* Библиотека пресетов */}
			<PresetLibrary onSelectPreset={setCustomPrompt} />
		</div>
	);
};

// Компонент для ввода количества изображений
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
		className="w-[50px] h-8 text-xs"
		placeholder="Images"
	/>
);

// Компонент для выбора режима Magic Prompt
const MagicPromptSelect = ({ value, onChange }) => (
	<Select value={value} onValueChange={onChange}>
		<SelectTrigger className="w-[80px] h-8 text-xs">
			<SelectValue placeholder="Magic">
				{value === 'ON' ? 'On' : value === 'OFF' ? 'Off' : 'Auto'}
			</SelectValue>
		</SelectTrigger>
		<SelectContent className="bg-white min-w-[80px] text-xs">
			<SelectItem value="ON">On</SelectItem>
			<SelectItem value="OFF">Off</SelectItem>
			<SelectItem value="AUTO">Auto</SelectItem>
		</SelectContent>
	</Select>
);

export default ImageGenerationControls;