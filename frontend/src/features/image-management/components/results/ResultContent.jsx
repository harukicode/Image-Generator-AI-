import { ImageGrid } from "./ImageGrid";

export const ResultContent = ({ images, onImageDelete }) => (
	<div className="bg-white rounded-2xl p-6">
		<ImageGrid
			images={images}
			onImageDelete={onImageDelete}
		/>
	</div>
);