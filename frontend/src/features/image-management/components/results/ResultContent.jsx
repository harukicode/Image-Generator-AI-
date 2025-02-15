import { ImageGrid } from "./ImageGrid";

export const ResultContent = ({ images, onImageDelete }) => (
	<div className="bg-white rounded-2xl">
		<ImageGrid
			images={images}
			onImageDelete={onImageDelete}
		/>
	</div>
);