import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import ImageUploadSection from './ImageUploadSection'

const ImageUploadDialog = ({ setUploadedImage, uploadedImage, resetPromptOnly }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-8 px-3"
				>
					{uploadedImage ? 'Change Image' : 'Upload Image'}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-3xl p-0 bg-white border-none shadow-2xl">
				<DialogHeader className="px-6 py-4 border-b">
					<DialogTitle>Upload Image</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<ImageUploadSection
						setUploadedImage={setUploadedImage}
						uploadedImage={uploadedImage}
						resetPromptOnly={resetPromptOnly}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ImageUploadDialog;