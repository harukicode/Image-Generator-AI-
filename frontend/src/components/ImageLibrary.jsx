"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, ImageIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"

function ImageLibrary({ onSelectImage }) {
  const [images, setImages] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredImage, setHoveredImage] = useState(null)
  
  useEffect(() => {
    fetchImages()
  }, [])
  
  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/images")
      setImages(response.data.images)
    } catch (error) {
      console.error("Failed to fetch images:", error)
    }
  }
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append("image", file)
      
      try {
        const response = await axios.post("http://localhost:3000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        // После успешной загрузки обновляем список изображений
        await fetchImages()
      } catch (error) {
        console.error("Failed to upload image:", error)
      }
    }
  }
  
  const handleImageDelete = async (image) => {
    try {
      console.log('Deleting image:', image.filename);
      
      const response = await axios.delete(`http://localhost:3000/api/images/${image.filename}`);
      
      if (response.data.success) {
        // Обновляем состояние только если удаление прошло успешно
        setImages(prevImages => prevImages.filter(img => img.id !== image.id));
      } else {
        console.error('Failed to delete image:', response.data.error);
        // Можно добавить toast уведомление об ошибке
      }
    } catch (error) {
      console.error('Error deleting image:', error.response?.data?.details || error.message);
      // Можно добавить toast уведомление об ошибке
      
      // Если файл не существует на сервере, все равно удаляем его из локального состояния
      if (error.response?.status === 404) {
        setImages(prevImages => prevImages.filter(img => img.id !== image.id));
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)} className="mb-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white">
        <ImageIcon className="mr-2 h-4 w-4" />
        Browse Library
      </Button>
      
      <DialogContent className="max-w-[900px] p-0 bg-white border-none shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b bg-[#6366F1]">
          <DialogTitle className="text-2xl font-semibold text-white">Image Library</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[600px]">
          <ScrollArea className="flex-grow p-6 bg-white">
            <div className="grid grid-cols-3 gap-6">
              <AnimatePresence>
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                    onMouseEnter={() => setHoveredImage(image.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg shadow-md">
                      <img
                        src={`http://localhost:3000${image.url}`}
                        alt={image.originalName || "Library image"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 flex items-center justify-center gap-2
                          ${hoveredImage === image.id ? "opacity-100" : "opacity-0"}`}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-white hover:bg-gray-100 text-gray-800"
                          onClick={() => {
                            onSelectImage(`http://localhost:3000${image.url}`)
                            setIsOpen(false)
                          }}
                        >
                          Select
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleImageDelete(image)}
                          className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
          
          <div className="p-6 border-t bg-gray-50">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <div
                className="flex items-center justify-center bg-white border-2 border-dashed border-[#6366F1] rounded-lg p-6 transition-colors duration-200 hover:bg-[#6366F1]/5">
                <Upload className="mr-2 text-[#6366F1]" />
                <span className="text-[#6366F1] font-medium">Upload New Image</span>
              </div>
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageLibrary

