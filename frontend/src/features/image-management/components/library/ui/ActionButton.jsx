import { Button } from "@/shared/ui/button";

export const ActionButton = ({ icon: Icon, label, variant = "default", ...props }) => (
	<Button
		size="sm"
		className={`px-4 py-2 rounded-lg shadow-md hover:shadow-lg
    transition-all flex items-center gap-2 font-medium
    ${variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white border-red-700" :
			variant === "primary" ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-700" :
				"bg-white hover:bg-gray-50 text-gray-900 border-gray-300"}`}
		{...props}
	>
		{Icon && <Icon className="w-5 h-5" />}
		{label}
	</Button>
);