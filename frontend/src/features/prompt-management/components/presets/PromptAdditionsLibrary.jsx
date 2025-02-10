import { BookPlus } from 'lucide-react';
import LibraryBase from './LibraryBase.jsx';

const PromptAdditionsLibrary = ({ onSelectAddition }) => {
	const config = {
		itemName: 'Addition',
		title: 'Prompt Additions',
		buttonText: 'Prompt Additions',
		nameField: 'name',
		contentField: 'content',
		nameLabel: 'Addition Name',
		contentLabel: 'Addition Content',
		emptyIcon: BookPlus,
		emptyMessage: 'No additions yet. Click "Add New" to create your first addition.',
		type: 'additions'
	};
	
	return (
		<LibraryBase
			config={config}
			onSelect={onSelectAddition}
			buttonIcon={BookPlus}
		/>
	);
};

export default PromptAdditionsLibrary;