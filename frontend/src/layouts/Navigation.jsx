import { NavLink } from 'react-router-dom';

const Navigation = () => {
	return (
		<nav className="flex items-center gap-4 bg-white rounded-lg p-2 shadow-sm">
			<NavLink
				to="/"
				className={({ isActive }) => `
          px-4 py-2 rounded-lg transition-colors
          ${isActive
					? "bg-[#6366F1] text-white"
					: "text-gray-600 hover:bg-[#6366F1]/10"
				}
        `}
			>
				Full Generator
			</NavLink>
			
			<NavLink
				to="/prompts"
				className={({ isActive }) => `
          px-4 py-2 rounded-lg transition-colors
          ${isActive
					? "bg-[#6366F1] text-white"
					: "text-gray-600 hover:bg-[#6366F1]/10"
				}
        `}
			>
				Prompts Only
			</NavLink>
		</nav>
	);
};

export default Navigation;