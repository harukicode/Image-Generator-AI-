import { Label } from "@/shared/ui/label"
import { History } from "lucide-react"

const KeepHistorySwitch = ({ isHistoryEnabled, onToggle }) => {
	return (
		<div className="flex items-center gap-2">
			<button
				role="switch"
				aria-checked={isHistoryEnabled}
				onClick={() => onToggle(!isHistoryEnabled)}
				className={`
          relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full
          transition-colors duration-200 ease-in-out focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          ${isHistoryEnabled ? "bg-[#6366F1]" : "bg-gray-200"}
        `}
			>
        <span
	        className={`
            pointer-events-none inline-block h-4 w-4 rounded-full bg-white
            shadow-sm ring-0 transition-transform duration-200 ease-in-out
            ${isHistoryEnabled ? "translate-x-[18px]" : "translate-x-0.5"}
          `}
        />
			</button>
			<Label className="text-sm text-gray-700 font-medium flex items-center gap-1.5 cursor-pointer select-none">
				<History className="h-4 w-4 text-gray-600" />
				Keep History
			</Label>
		</div>
	)
}

export default KeepHistorySwitch

