import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/shared/ui/dialog.jsx"
import { Input } from "@/shared/ui/input.jsx"
import { Button } from "@/shared/ui/button.jsx"
import { Label } from "@/shared/ui/label.jsx"
import { Download } from 'lucide-react'

const DownloadDialog = ({ isOpen, onClose, onDownload }) => {
	const [companyName, setCompanyName] = React.useState("");
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if (companyName.trim()) {
			onDownload(companyName.trim());
			setCompanyName("");
			onClose();
		}
	};
	
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md bg-white rounded-xl border-0 shadow-2xl">
				<DialogHeader className="space-y-3 pb-2">
					<DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
						<div className="p-2 bg-blue-50 rounded-lg">
							<Download className="w-5 h-5 text-blue-600" />
						</div>
						Download Images
					</DialogTitle>
					<p className="text-sm text-gray-500 font-normal">
						Enter a company name to use as a prefix for the downloaded image files.
					</p>
				</DialogHeader>
				
				<form onSubmit={handleSubmit} className="space-y-6 py-4">
					<div className="space-y-2">
						<Label
							htmlFor="company"
							className="text-sm font-medium text-gray-700"
						>
							Company Name
						</Label>
						<Input
							id="company"
							placeholder="Enter company name..."
							value={companyName}
							onChange={(e) => setCompanyName(e.target.value)}
							className="w-full h-11 px-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
						/>
						<p className="text-xs text-gray-500 mt-1.5">
							Files will be saved as: {companyName.trim() ? `${companyName.trim()}-XX.png` : 'company-name-XX.png'}
						</p>
					</div>
					
					<DialogFooter className="sm:justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="w-full sm:w-auto bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 h-11 px-6 rounded-lg transition-colors duration-200"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!companyName.trim()}
							className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 rounded-lg transition-colors duration-200 disabled:bg-blue-400"
						>
							Download Now
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default DownloadDialog;