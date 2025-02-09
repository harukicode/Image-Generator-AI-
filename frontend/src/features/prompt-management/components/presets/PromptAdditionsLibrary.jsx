import LibraryBase from '@/features/prompt-management/components/presets/LibraryBase.jsx'
import { BookPlus } from 'lucide-react'

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
	};
	
	return (
		<LibraryBase
			config={config}
			storageKey="promptAdditions"
			onSelect={onSelectAddition}
			buttonIcon={BookPlus}
		/>
	);
};

export default PromptAdditionsLibrary;