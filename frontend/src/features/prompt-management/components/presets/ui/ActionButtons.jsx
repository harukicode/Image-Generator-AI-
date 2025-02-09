import { Button } from "@/shared/ui/button";
import { Edit, Trash2 } from "lucide-react";

const ActionButtons = ({ onSelect, onEdit, onDelete }) => {
	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				onClick={onSelect}
				className="text-[#6366F1] hover:text-[#4F46E5] hover:bg-[#6366F1]/10"
			>
				Use
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={onEdit}
				className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
			>
				<Edit className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={onDelete}
				className="text-red-600 hover:text-red-700 hover:bg-red-50"
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</>
	);
};

export default ActionButtons;