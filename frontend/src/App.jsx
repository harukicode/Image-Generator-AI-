"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import Header from "./components/Header"
import ImageUploadSection from "./components/ImageUploadSection"
import GenerationSection from "./components/GenerationSection"
import ResultSection from "./components/ResultSection"
import ImageLibraryPage from "./components/GeneratedImagesLibrary.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [newCompanyName, setNewCompanyName] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState([])
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)
  const [error, setError] = useState(null)
  const [chatContext, setChatContext] = useState(null)
  const [userPrompt, setUserPrompt] = useState("") // Для пользовательского ввода
  const [numImages, setNumImages] = useState(4)
  const [magicPrompt, setMagicPrompt] = useState("AUTO")
  
  
  const handleReset = () => {
    setCurrentPrompt("")
    setGeneratedImages([])
    setError(null)
    setChatContext(null)
    setUserPrompt("")
  }
  
  const handleStartPromptGeneration = async () => {
    setIsGeneratingPrompt(true)
    setError(null)
    setChatContext(null) // Сбрасываем контекст при новом изображении
    
    try {
      if (!uploadedImage || !newCompanyName) {
        throw new Error("Please provide both an image and a company name")
      }
      
      const formData = new FormData()
      formData.append("image", uploadedImage)
      formData.append("newName", newCompanyName)
      
      const response = await axios.post("http://localhost:3000/api/generate-prompt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      
      if (response.data.success) {
        setCurrentPrompt(response.data.prompt)
        setChatContext(response.data.context) // Сохраняем контекст чата
      } else {
        throw new Error(response.data.error || "Prompt generation failed")
      }
    } catch (err) {
      console.error("Prompt generation error:", err)
      setError(err.response?.data?.error || err.message || "An error occurred during prompt generation")
    } finally {
      setIsGeneratingPrompt(false)
    }
  }
  
  const handleRegeneratePrompt = async () => {
    setIsGeneratingPrompt(true)
    setError(null)
    
    try {
      const response = await axios.post("http://localhost:3000/api/regenerate-prompt", {
        context: chatContext,
        userPrompt: userPrompt || undefined // Отправляем пользовательский ввод, если он есть
      })
      
      if (response.data.success) {
        setCurrentPrompt(response.data.prompt)
        setChatContext(response.data.context)
      } else {
        throw new Error(response.data.error || "Prompt regeneration failed")
      }
    } catch (err) {
      console.error("Prompt regeneration error:", err)
      setError(err.response?.data?.error || err.message || "An error occurred during prompt regeneration")
    } finally {
      setIsGeneratingPrompt(false)
    }
  }
  
  const handleGenerate = async () => {
    setIsGeneratingImages(true)
    setError(null)
    
    try {
      if (!currentPrompt) {
        throw new Error("No prompt available")
      }
      
      const response = await axios.post("http://localhost:3000/api/generate-images", {
        prompt: currentPrompt,
        companyName: newCompanyName,
        numImages: numImages,
        magicPrompt: magicPrompt
      })
      
      if (response.data.success) {
        setGeneratedImages(response.data.imageUrls)
      } else {
        throw new Error(response.data.error || "Image generation failed")
      }
    } catch (err) {
      console.error("Image generation error:", err)
      setError(err.response?.data?.error || err.message)
      setGeneratedImages([])
    } finally {
      setIsGeneratingImages(false)
    }
  }
  
  const handleImageDelete = async (imageUrl) => {
    try {
      // Извлекаем имя файла из URL
      const filename = imageUrl.split('/').pop();
      
      // Удаляем изображение через API
      const response = await axios.delete(`http://localhost:3000/api/generated-images/${filename}`);
      
      if (response.data.success) {
        // Обновляем локальное состояние
        setGeneratedImages(generatedImages.filter((img) => img !== imageUrl));
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      setError("Failed to delete image. Please try again.");
    }
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
                <ImageUploadSection setUploadedImage={setUploadedImage} onReset={handleReset} />
              </motion.div>
              <motion.div
                className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
                whileHover={{ y: -2 }}
              >
                <GenerationSection
                  newCompanyName={newCompanyName}
                  setNewCompanyName={setNewCompanyName}
                  onStartPromptGeneration={handleStartPromptGeneration}
                  onRegeneratePrompt={handleRegeneratePrompt}
                  onGenerate={handleGenerate}
                  currentPrompt={currentPrompt}
                  userPrompt={userPrompt}
                  setUserPrompt={setUserPrompt}
                  isGeneratingPrompt={isGeneratingPrompt}
                  isGeneratingImages={isGeneratingImages}
                  isStartDisabled={!uploadedImage || !newCompanyName}
                  numImages={numImages}
                  magicPrompt={magicPrompt}
                  setMagicPrompt={setMagicPrompt}
                  setNumImages={setNumImages}
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
                  onImageDelete={handleImageDelete}
                  companyName={newCompanyName}
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

