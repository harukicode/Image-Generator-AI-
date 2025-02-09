import { createBatches, generateAllBatches } from '@/utils/batchImageGeneration.jsx'
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
  const [customPrompt, setCustomPrompt] = useState("") // Заменяем newCompanyName на customPrompt
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState([])
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)
  const [error, setError] = useState(null)
  const [chatContext, setChatContext] = useState(null)
  const [userPrompt, setUserPrompt] = useState("")
  const [numImages, setNumImages] = useState(4)
  const [magicPrompt, setMagicPrompt] = useState("AUTO")
  
  const [generationProgress, setGenerationProgress] = useState({
    totalBatches: 0,
    completedBatches: 0,
    isGenerating: false
  });
  
  const handleReset = () => {
    setCurrentPrompt("")
    setGeneratedImages([])
    setError(null)
    setChatContext(null)
    setUserPrompt("")
    setCustomPrompt("") // Добавляем сброс пользовательского промпта
  }
  
  const handleStartPromptGeneration = async () => {
    setIsGeneratingPrompt(true)
    setError(null)
    setChatContext(null)
    
    try {
      if (!uploadedImage || !customPrompt) {
        throw new Error("Please provide both an image and a prompt")
      }
      
      const formData = new FormData()
      formData.append("image", uploadedImage)
      formData.append("customPrompt", customPrompt) // Изменяем newName на customPrompt
      
      const response = await axios.post("http://localhost:3000/api/generate-prompt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      
      if (response.data.success) {
        setCurrentPrompt(response.data.prompt)
        setChatContext(response.data.context)
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
        userPrompt: userPrompt || undefined
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
    if (!currentPrompt || !numImages) {
      setError("Please provide a prompt and number of images");
      return;
    }
    
    setIsGeneratingImages(true);
    setError(null);
    setGeneratedImages([]);
    
    try {
      const batches = createBatches(parseInt(numImages));
      
      setGenerationProgress({
        totalBatches: batches.length,
        completedBatches: 0,
        isGenerating: true
      });
      
      const result = await generateAllBatches({
        batches,
        prompt: currentPrompt,
        magicPrompt,
        onBatchComplete: ({ completedBatches, totalBatches, newImages, allImages }) => {
          setGenerationProgress(prev => ({
            ...prev,
            completedBatches
          }));
          setGeneratedImages(allImages); // Обновляем изображения по мере их генерации
        },
        onError: (error, completedBatches) => {
          setError(`Error during batch ${completedBatches + 1}: ${error.message}`);
          // Продолжаем показывать уже сгенерированные изображения
        }
      });
      
    } catch (err) {
      console.error("Image generation error:", err);
      setError(err.message || "Failed to generate images");
    } finally {
      setIsGeneratingImages(false);
      setGenerationProgress(prev => ({
        ...prev,
        isGenerating: false
      }));
    }
  };
  
  const handleImageDelete = async (image) => {
    try {
      const filename = image.split('/').pop();
      const response = await axios.delete(`http://localhost:3000/api/generated-images/${filename}`);
      
      if (response.data.success) {
        setGeneratedImages(prevImages => prevImages.filter(img => img !== image));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setError("Failed to delete image. Please try again.");
    }
  };
  
  
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
                  customPrompt={customPrompt}
                  setCustomPrompt={setCustomPrompt}
                  onStartPromptGeneration={handleStartPromptGeneration}
                  onRegeneratePrompt={handleRegeneratePrompt}
                  onGenerate={handleGenerate}
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
                  onImageDelete={handleImageDelete}
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