const EmptyState = ({ icon: Icon, message }) => (
	<div className="text-center py-8 text-gray-500">
		<Icon className="h-12 w-12 mx-auto mb-3 opacity-50" />
		<p>{message}</p>
	</div>
);

export default EmptyState;