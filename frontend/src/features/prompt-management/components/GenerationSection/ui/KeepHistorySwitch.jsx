import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"
import { History } from "lucide-react"

const KeepHistorySwitch = ({ isHistoryEnabled, onToggle }) => {
	return (
		<div className="flex items-center gap-2">
			<Switch
				id="keep-history"
				checked={isHistoryEnabled}
				onCheckedChange={onToggle}
				className="data-[state=checked]:bg-[#6366F1]"
			/>
			<Label
				htmlFor="keep-history"
				className="text-sm text-gray-600 font-medium flex items-center gap-1.5 cursor-pointer"
			>
				<History className="h-3.5 w-3.5" />
				Keep History
			</Label>
		</div>
	)
}

export default KeepHistorySwitch