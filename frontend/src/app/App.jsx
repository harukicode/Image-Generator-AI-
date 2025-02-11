"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "@/widgets/header/Header.jsx"
import ImageUploadSection from "@/widgets/image-upload/ImageUploadSection.jsx"
import GenerationSection from "@/features/prompt-management/components/GenerationSection/GenerationSection.jsx"
import { ResultSection } from "@/features/image-management/components/results/ResultSection"
import ImageLibraryPage from "@/features/image-management/components/library/components/GeneratedImagesLibrary.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Button } from "@/shared/ui/button"
import { usePromptGeneration } from "@/features/prompt-management/hooks/usePromptGeneration"
import { useImageGeneration } from "@/features/image-management/hooks/useImageGeneration"

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [contextSize, setContextSize] = useState(20)
  const [isUploadVisible, setIsUploadVisible] = useState(true)
  
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
    generatePrompt(uploadedImage, contextSize)
  }
  
  const handleRegeneratePrompt = () => {
    regeneratePrompt(userPrompt, contextSize)
  }
  
  const handleReset = () => {
    resetPrompt()
    setUploadedImage(null)
  }
  
  const toggleUploadSection = () => {
    setIsUploadVisible(!isUploadVisible)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F0FF] to-[#E8E3FF] p-4 sm:p-6 lg:p-8">
      
      <Tabs defaultValue="generator" className="w-full">
        <div className="flex items-center gap-4 mb-3">
          <TabsList>
            <TabsTrigger value="generator">Image Generator</TabsTrigger>
            <TabsTrigger value="library">Image Library</TabsTrigger>
          </TabsList>
          <Button variant="outline" onClick={toggleUploadSection}>
            {isUploadVisible ? "Hide Image Upload" : "Show Image Upload"}
          </Button>
        </div>
        <TabsContent value="generator">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="flex-1">
              <div className="relative">
                <div
                  className={`
        bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 hover:shadow-md
        transition-all duration-300 ease-in-out absolute w-full
        ${isUploadVisible ? 'opacity-100 relative' : 'opacity-0 invisible'}
      `}
                >
                  <ImageUploadSection setUploadedImage={setUploadedImage} onReset={handleReset} />
                </div>
                
                <div
                  className={`
        bg-white rounded-2xl shadow-sm p-4 sm:p-4 lg:p-4 hover:shadow-md
        transition-all duration-300 ease-in-out
        ${!isUploadVisible ? 'translate-y-0' : 'translate-y-4'}
      `}
                >
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
                  />
                </div>
              </div>
            </div>
            <motion.div
              className="flex-1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 hover:shadow-md transition-shadow duration-300">
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
  )
}

export default App

