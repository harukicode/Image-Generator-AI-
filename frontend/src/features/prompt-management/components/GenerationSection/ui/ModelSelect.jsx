import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

const ModelSelect = ({ value, onChange }) => (
	<Select value={value} onValueChange={onChange}>
		<SelectTrigger className="w-[100px] h-8 text-xs">
			<SelectValue placeholder="Model">
				{value === 'gpt' ? 'ChatGPT' : 'Claude'}
			</SelectValue>
		</SelectTrigger>
		<SelectContent className="bg-white min-w-[100px] text-xs">
			<SelectItem value="gpt">ChatGPT</SelectItem>
			<SelectItem value="claude">Claude</SelectItem>
		</SelectContent>
	</Select>
);

export default ModelSelect;