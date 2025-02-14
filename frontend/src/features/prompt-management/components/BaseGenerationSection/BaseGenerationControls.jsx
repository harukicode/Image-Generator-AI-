import { Input } from '@/shared/ui/input'
import { Info } from 'lucide-react'

const BaseGenerationControls = ({
	                                className,
	                                contextSize,
	                                setContextSize,
	                                companyName,
	                                setCompanyName,
                                }) => {
	return (
		<div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
			<div className="flex items-center gap-1.5 min-w-0">
				{/* Ввод названия компании */}
				<Input
					type="text"
					placeholder="Company name"
					className="w-[120px] h-8 text-xs"
					value={companyName}
					onChange={(e) => setCompanyName(e.target.value)}
				/>
				
				{/* Контроль размера контекста */}
				<ContextSizeInput value={contextSize} onChange={setContextSize} />
			</div>
		</div>
	);
};

// Компонент для ввода размера контекста с подсказкой
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
			className="w-[60px] pr-6 h-8 text-xs"
			placeholder="Context"
		/>
		<div className="absolute right-1.5 top-1/2 -translate-y-1/2 group">
			<Info className="w-3 h-3 text-gray-400" />
			<div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
				Number of previous messages to keep in context (2-500)
			</div>
		</div>
	</div>
);

export default BaseGenerationControls;