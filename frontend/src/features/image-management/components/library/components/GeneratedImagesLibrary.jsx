import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, Trash2, Info, Edit3, Briefcase, Calendar } from 'lucide-react'
import { Button } from "@/shared/ui/button.jsx"
import { useToast } from "@/shared/hooks/use-toast.js"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog.jsx"
import axios from "axios"
import DowloadDialog from "../../ui/download-dialog.jsx"

function GeneratedImagesLibrary() {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false)
  const [imageToDownload, setImageToDownload] = useState(null)
  const { toast } = useToast()
  
  useEffect(() => {
    fetchImages()
  }, [])
  
  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/generated-images")
      setImages(response.data.images)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch generated images",
        variant: "destructive",
      })
    }
  }
  
  const handleDelete = async (image) => {
    try {
      console.log('Deleting image:', image.filename)
      await axios.delete(`http://localhost:3000/api/generated-images/${image.filename}`)
      setImages(prevImages => prevImages.filter(img => img.id !== image.id))
      toast({
        title: "Success",
        description: "Image deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting image:', error)
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete image",
        variant: "destructive",
      })
    }
  }
  
  const handleDownload = async (companyName) => {
    try {
      if (!imageToDownload) return
      
      // Получаем индекс из имени файла
      const fileIndex = imageToDownload.filename.match(/\d{2}\.png$/)[0]
      
      // Создаем новое имя файла
      const newFilename = `${companyName}-${fileIndex}`
      
      // Делаем GET запрос для получения файла
      const response = await axios({
        url: `http://localhost:3000/generated/${imageToDownload.filename}`,
        method: 'GET',
        responseType: 'blob',
      })
      
      // Создаем URL для скачивания
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
      
      // Создаем ссылку для скачивания
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', newFilename)
      
      // Запускаем скачивание
      document.body.appendChild(link)
      link.click()
      
      // Очищаем
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      setImageToDownload(null)
      setIsDownloadDialogOpen(false)
      
      toast({
        title: "Success",
        description: "Image downloaded successfully",
      })
      
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      })
    }
  }
  
  const initiateDownload = (image) => {
    setImageToDownload(image)
    setIsDownloadDialogOpen(true)
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Generated Images Library</h1>
      
      {/* Download Dialog */}
      <DowloadDialog
        isOpen={isDownloadDialogOpen}
        onClose={() => {
          setIsDownloadDialogOpen(false)
          setImageToDownload(null)
        }}
        onDownload={handleDownload}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <motion.div
            key={image.id}
            className="relative group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={`http://localhost:3000/generated/${image.filename}`}
              alt={`Generated for ${image.company_name}`}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-lg
                    border border-gray-300 shadow-md hover:shadow-lg transition-all
                    flex items-center gap-2 font-medium"
                  >
                    <Info className="w-5 h-5" />
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-xl max-w-md p-6 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Info className="w-6 h-6 text-blue-600" />
                      Image Details
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-5 mt-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Briefcase className="w-4 h-4" />
                        Company
                      </div>
                      <p className="text-gray-800 text-base pl-6">{image.company_name}</p>
                    </div>
                    
                    <div className="border-t border-gray-200 my-3" />
                    
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Edit3 className="w-4 h-4" />
                        Generation Prompt
                      </div>
                      <p className="text-gray-800 text-base bg-gray-50 rounded-lg p-3.5">
                        {image.prompt}
                      </p>
                    </div>
                    
                    <div className="border-t border-gray-200 my-3" />
                    
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Created At
                      </div>
                      <p className="text-gray-800 text-base pl-6">
                        {new Date(image.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Download Button */}
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg
                border border-blue-700 shadow-md hover:shadow-lg transition-all
                flex items-center gap-2 font-medium"
                onClick={() => initiateDownload(image)}
              >
                <Download className="w-5 h-5" />
                Download
              </Button>
              
              {/* Delete Button */}
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg
                border border-red-700 shadow-md hover:shadow-lg transition-all
                flex items-center gap-2 font-medium"
                onClick={() => handleDelete(image)}
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default GeneratedImagesLibrary