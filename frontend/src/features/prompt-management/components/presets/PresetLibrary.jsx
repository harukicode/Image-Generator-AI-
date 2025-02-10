import { Library } from 'lucide-react';
import React from 'react';
import LibraryBase from './LibraryBase.jsx';

const PresetLibrary = ({ onSelectPreset }) => {
	const config = {
		itemName: 'Preset',
		title: 'Prompt Presets',
		buttonText: 'Prompt Presets',
		nameField: 'name',
		contentField: 'prompt',
		nameLabel: 'Preset Name',
		contentLabel: 'Prompt Template',
		emptyIcon: Library,
		emptyMessage: 'No presets yet. Click "Add New" to create your first preset.',
		type: 'presets'
	};
	
	return (
		<LibraryBase
			config={config}
			onSelect={onSelectPreset}
			buttonIcon={Library}
		/>
	);
};

export default PresetLibrary;