import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import ImageUploadSection from './ImageUploadSection'

const ImageUploadDialog = ({ setUploadedImage, onReset, uploadedImage }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">
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
						onReset={onReset}
						uploadedImage={uploadedImage}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ImageUploadDialog;