import { useState } from "react"
import { motion } from "framer-motion"
import Header from "@/widgets/header/Header.jsx"
import ImageUploadSection from "@/widgets/image-upload/ImageUploadSection.jsx"
import GenerationSection from "@/features/prompt-management/components/GenerationSection/GenerationSection.jsx"
import { ResultSection } from '@/features/image-management/components/results/ResultSection'
import ImageLibraryPage from "@/features/image-management/components/library/components/GeneratedImagesLibrary.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { usePromptGeneration } from "@/features/prompt-management/hooks/usePromptGeneration"
import { useImageGeneration } from "@/features/image-management/hooks/useImageGeneration"

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  
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
    reset: resetPrompt
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
    deleteImage
  } = useImageGeneration()
  
  const handleReset = () => {
    resetPrompt()
    setUploadedImage(null)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#F3F0FF] to-[#E8E3FF] p-8"
    >
      <Header />
      
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="generator">Image Generator</TabsTrigger>
          <TabsTrigger value="library">Image Library</TabsTrigger>
        </TabsList>
        <TabsContent value="generator">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              className="flex-1 space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
                whileHover={{ y: -2 }}
              >
                <ImageUploadSection
                  setUploadedImage={setUploadedImage}
                  onReset={handleReset}
                />
              </motion.div>
              <motion.div
                className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
                whileHover={{ y: -2 }}
              >
                <GenerationSection
                  customPrompt={customPrompt}
                  setCustomPrompt={setCustomPrompt}
                  onStartPromptGeneration={() => generatePrompt(uploadedImage)}
                  onRegeneratePrompt={regeneratePrompt}
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
                />
              </motion.div>
            </motion.div>
            <motion.div
              className="flex-1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-sm p-8 h-full hover:shadow-md transition-shadow duration-300"
                whileHover={{ y: -2 }}
              >
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
    </motion.div>
  )
}

export default App