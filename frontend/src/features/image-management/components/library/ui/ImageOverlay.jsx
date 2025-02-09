export const ImageOverlay = ({ children, isVisible }) => (
	<div
		className={`absolute inset-0 bg-black bg-opacity-60
    transition-opacity duration-200 flex items-center justify-center gap-2
    ${isVisible ? "opacity-100" : "opacity-0"}`}
	>
		{children}
	</div>
);