import GeneratedImagesLibrary
	from '@/features/image-management/components/library/components/GeneratedImagesLibrary.jsx'
import { ImageProvider } from '@/features/image-management/components/ui/ImageContext';
import { FullGenerationTab } from '@/features/prompt-management/components/tabs/FullGenerationTab.jsx'
import { PromptsOnlyTab } from '@/features/prompt-management/components/tabs/PromptsOnlyTab.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";


function GeneratorPage() {
	return (
		<ImageProvider>
			<div className="w-full flex flex-col min-h-screen">
				<Tabs defaultValue="image-generator" className="flex-1 flex flex-col w-full">
					<div className="w-full mb-4">
						<TabsList className="w-full bg-white rounded-lg p-1 shadow-sm">
							<TabsTrigger value="image-generator">
								Image Generator
							</TabsTrigger>
							<TabsTrigger value="prompts-only">
								Prompts Only
							</TabsTrigger>
							<TabsTrigger value="image-library">
								Image Library
							</TabsTrigger>
						</TabsList>
					</div>
					
					<div className="flex-1 w-full px-4">
						<TabsContent value="image-generator" className="h-full w-full mt-0">
								<FullGenerationTab />
						</TabsContent>
						
						<TabsContent value="prompts-only" className="h-full w-full mt-0">
								<PromptsOnlyTab />
						</TabsContent>
						
						<TabsContent value="image-library" className="h-full w-full mt-0">
							<GeneratedImagesLibrary />
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</ImageProvider>
	);
}

export default GeneratorPage;