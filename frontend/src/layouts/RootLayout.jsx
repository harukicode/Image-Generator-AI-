import { Outlet } from 'react-router-dom';
import { Toaster } from "@/shared/ui/toaster";
import Navigation from './Navigation';

const RootLayout = () => {
	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-[#F3F0FF] to-[#E8E3FF] p-4 sm:p-6 lg:p-8">
				<Navigation />
				
				<main className="mt-6">
					<Outlet />
				</main>
			</div>
			
			<Toaster />
		</>
	);
};

export default RootLayout;