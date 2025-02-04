import { useState } from "react"
import { motion } from "framer-motion"
import Header from "./components/Header"
import ImageUploadSection from "./components/ImageUploadSection"
import GenerationSection from "./components/GenerationSection"
import ResultSection from "./components/ResultSection"

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [companyName, setCompanyName] = useState("")
  const [generatedImage, setGeneratedImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const handleGenerate = async () => {
    setIsGenerating(true)
    // Имитация задержки генерации
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const newImage = `https://picsum.photos/800/600?random=${Date.now()}`
    setGeneratedImage(newImage)
    setIsGenerating(false)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#F3F0FF] to-[#E8E3FF] p-8"
    >
      <Header />
      <div className="flex gap-8">
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
            <ImageUploadSection setUploadedImage={setUploadedImage} />
          </motion.div>
          <motion.div
            className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
            whileHover={{ y: -2 }}
          >
            <GenerationSection
              companyName={companyName}
              setCompanyName={setCompanyName}
              onGenerate={handleGenerate}
              isGenerateDisabled={!uploadedImage || !companyName}
              isGenerating={isGenerating}
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
            <ResultSection generatedImage={generatedImage} isGenerating={isGenerating} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default App

