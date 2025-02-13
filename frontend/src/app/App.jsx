import ImageUploadDialog from '@/widgets/image-upload/ImageUploadDialog.jsx'
import { useState } from "react"
import { motion } from "framer-motion"
import GenerationSection from "@/features/prompt-management/components/GenerationSection/GenerationSection.jsx"
import { ResultSection } from "@/features/image-management/components/results/ResultSection"
import ImageLibraryPage from "@/features/image-management/components/library/components/GeneratedImagesLibrary.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { usePromptGeneration } from "@/features/prompt-management/hooks/usePromptGeneration"
import { useImageGeneration } from "@/features/image-management/hooks/useImageGeneration"
import { Toaster } from "../shared/ui/toaster.jsx"

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [contextSize, setContextSize] = useState(20)
  const [companyName, setCompanyName] = useState("");
  
  const {
    currentPrompt,
    isGeneratingPrompt,
    error,
    userPrompt,
    setUserPrompt,
    customPrompt,
    setCustomPrompt,
    generatePrompt,
    regeneratePrompt,
    reset: resetPrompt,
  } = usePromptGeneration()
  
  const {
    generatedImages,
    isGeneratingImages,
    numImages,
    setNumImages,
    magicPrompt,
    setMagicPrompt,
    generationProgress,
    generateImages,
    deleteImage,
  } = useImageGeneration()
  
  const handleStartPromptGeneration = () => {
    generatePrompt(uploadedImage, contextSize, companyName)
  }
  
  const handleRegeneratePrompt = () => {
    regeneratePrompt(userPrompt, contextSize, companyName)
  }
  
  const handleReset = () => {
    setUploadedImage(null)
    setUserPrompt('')
    if (resetPrompt) {
      resetPrompt()
    }
  }
  

  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#F3F0FF] to-[#E8E3FF] p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="generator" className="w-full">
          <div className="flex items-center gap-4 mb-3">
            <TabsList>
              <TabsTrigger value="generator">Image Generator</TabsTrigger>
              <TabsTrigger value="library">Image Library</TabsTrigger>
            </TabsList>
            <ImageUploadDialog
              setUploadedImage={setUploadedImage}
              onReset={handleReset}
              uploadedImage={uploadedImage}
            />
          </div>
          <TabsContent value="generator">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-4 lg:p-4 hover:shadow-md transition-all duration-300 ease-in-out">
                  <GenerationSection
                    customPrompt={customPrompt}
                    setCustomPrompt={setCustomPrompt}
                    onStartPromptGeneration={handleStartPromptGeneration}
                    onRegeneratePrompt={handleRegeneratePrompt}
                    onGenerate={() => generateImages(currentPrompt)}
                    currentPrompt={currentPrompt}
                    userPrompt={userPrompt}
                    setUserPrompt={setUserPrompt}
                    isGeneratingPrompt={isGeneratingPrompt}
                    isGeneratingImages={isGeneratingImages}
                    isStartDisabled={!uploadedImage || !customPrompt}
                    numImages={numImages}
                    setNumImages={setNumImages}
                    magicPrompt={magicPrompt}
                    setMagicPrompt={setMagicPrompt}
                    contextSize={contextSize}
                    setContextSize={setContextSize}
                    reset={resetPrompt}
                    setCompanyName={setCompanyName}
                    companyName={companyName}
                  />
                </div>
              </div>
              <motion.div
                className="flex-1"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 hover:shadow-md transition-shadow duration-300">
                  <ResultSection
                    generatedImages={generatedImages}
                    isGenerating={isGeneratingImages}
                    error={error}
                    onImageDelete={deleteImage}
                    generationProgress={generationProgress}
                  />
                </motion.div>
              </motion.div>
            </div>
          </TabsContent>
          <TabsContent value="library">
            <ImageLibraryPage />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </>
  )
}

export default App