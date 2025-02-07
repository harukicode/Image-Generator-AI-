"use client"

import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { motion } from "framer-motion"
import ImageLibrary from "./ImageLibrary"
import axios from "axios"
import { Button } from "@/components/ui/button"

function ImageUploadSection({ setUploadedImage, onReset }) {
  const [preview, setPreview] = useState(null)
  const [isDragActive, setIsDragActive] = useState(false)
  
  const {
    getRootProps,
    getInputProps,
    isDragActive: isDropzoneDragActive,
  } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0]
      const formData = new FormData()
      formData.append("image", file)
      
      try {
        const response = await axios.post("http://localhost:3000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        setPreview(`http://localhost:3000${response.data.imageUrl}`)
        setUploadedImage(file)
      } catch (error) {
        console.error("Failed to upload image:", error)
      }
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  })
  
  useEffect(() => {
    setIsDragActive(isDropzoneDragActive)
  }, [isDropzoneDragActive])
  
  const handleSelectImage = async (imageUrl) => {
    onReset() // Сбрасываем предыдущие результаты при выборе нового изображения
    setPreview(imageUrl)
    try {
      const response = await axios.get(imageUrl, { responseType: "blob" })
      const file = new File([response.data], "selected_image.jpg", { type: "image/jpeg" })
      setUploadedImage(file)
    } catch (error) {
      console.error("Failed to fetch selected image:", error)
    }
  }
  
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload an image</h2>
      <div className="flex items-center space-x-4">
        <ImageLibrary onSelectImage={handleSelectImage} />
        <span className="text-gray-400">or</span>
        <motion.div
          className={`flex-grow border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          {...getRootProps()}
          onClick={() => onReset()} // Сбрасываем предыдущие результаты при клике на область загрузки
        >
          <input {...getInputProps()} />
          {preview ? (
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="max-w-[300px] max-h-[300px] mx-auto rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600">Drag and drop or click to upload</p>
            </div>
          )}
        </motion.div>
      </div>
      {preview && (
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setPreview(null)
            setUploadedImage(null)
            onReset() // Сбрасываем предыдущие результаты при удалении изображения
          }}
        >
          Remove Image
        </Button>
      )}
    </section>
  )
}

export default ImageUploadSection