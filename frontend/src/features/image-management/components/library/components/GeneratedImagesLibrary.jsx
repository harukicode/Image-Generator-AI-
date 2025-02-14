import { useDeleteImage } from '@/features/image-management/components/library/hooks/useDeleteImages.jsx'
import { useImageDownload } from '@/features/image-management/components/library/hooks/useImageDownload.jsx'
import { useGeneratedImagesGrid } from '@/features/image-management/components/library/hooks/useGeneratedImagesGrid.jsx'
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Trash2, Info, Edit3, Briefcase, Calendar } from 'lucide-react';
import { Button } from "@/shared/ui/button.jsx";
import { useToast } from "@/shared/hooks/use-toast.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog.jsx";
import { Pagination } from "../../results/Pagination";
import axios from "axios";
import DownloadDialog from "../../ui/download-dialog.jsx";

function GeneratedImagesLibrary() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { deleteImage, isDeleting } = useDeleteImage();
  const {
    isDownloadDialogOpen,
    setIsDownloadDialogOpen,
    imageToDownload,
    setImageToDownload,
    downloadImage
  } = useImageDownload();
  
  const {
    selectedImages,
    currentPage,
    totalPages,
    getCurrentPageImages,
    toggleImageSelection,
    setCurrentPage,
    clearSelection,
  } = useGeneratedImagesGrid(images);
  
  const { toast } = useToast();
  
  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/api/generated-images");
      
      if (response.data.success) {
        setImages(response.data.data.images || []);
      } else {
        throw new Error(response.data.error || "Failed to fetch images");
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to fetch generated images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchImages();
  }, []);
  
  const handleDelete = (image) => {
    deleteImage(image, () => {
      setImages(prevImages => prevImages.filter(img => img.id !== image.id));
    });
  };
  
  const handleBulkDelete = () => {
    const selectedArray = Array.from(selectedImages);
    selectedArray.forEach(image => handleDelete(image));
    clearSelection();
  };
  
  const handleDownload = async (companyName) => {
    try {
      const images = imageToDownload ? [imageToDownload] : Array.from(selectedImages);
      
      for (const [index, image] of images.entries()) {
        const response = await axios({
          url: `http://localhost:3000/generated/${image.filename}`,
          method: 'GET',
          responseType: 'blob',
        });
        
        const fileNumber = (index + 1).toString().padStart(2, '0');
        const newFilename = `${companyName}-${fileNumber}.png`;
        
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', newFilename);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }
      
      setIsDownloadDialogOpen(false);
      setImageToDownload(null);
      clearSelection();
      
      toast({
        title: "Success",
        description: "Images downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download images",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Generated Images Library</h1>
        {selectedImages.size > 0 && (
          <Button
            variant="default"
            onClick={() => setIsDownloadDialogOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-4 w-4" />
            Download Selected ({selectedImages.size})
          </Button>
        )}
      </div>
      
      <DownloadDialog
        isOpen={isDownloadDialogOpen}
        onClose={() => {
          setIsDownloadDialogOpen(false);
          setImageToDownload(null);
        }}
        onDownload={handleDownload}
      />
      
      {images.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No generated images yet
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-500 text-center">
            Showing {Math.min(12, images.length - (currentPage - 1) * 12)} of {images.length} images
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {getCurrentPageImages().map((image) => (
                <motion.div
                  key={image.id}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isDeleting(image.id) ? 0.5 : 1,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => toggleImageSelection(image)}
                >
                  <img
                    src={`http://localhost:3000/generated/${image.filename}`}
                    alt={`Generated for ${image.company_name}`}
                    className={`w-full aspect-square object-cover rounded-lg transition-all duration-200 ${
                      selectedImages.has(image) ? 'ring-4 ring-blue-500 ring-offset-2' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                    {/*<Dialog>*/}
                    {/*  <DialogTrigger asChild>*/}
                    {/*    <Button*/}
                    {/*      size="sm"*/}
                    {/*      className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-lg*/}
                    {/*                border border-gray-300 shadow-md hover:shadow-lg transition-all*/}
                    {/*                flex items-center gap-2 font-medium"*/}
                    {/*      onClick={(e) => e.stopPropagation()}*/}
                    {/*    >*/}
                    {/*      <Info className="w-5 h-5" />*/}
                    {/*      Details*/}
                    {/*    </Button>*/}
                    {/*  </DialogTrigger>*/}
                    {/*  <DialogContent className="rounded-xl max-w-md p-6 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">*/}
                    {/*    <DialogHeader>*/}
                    {/*      <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">*/}
                    {/*        <Info className="w-6 h-6 text-blue-600" />*/}
                    {/*        Image Details*/}
                    {/*      </DialogTitle>*/}
                    {/*    </DialogHeader>*/}
                    {/*    */}
                    {/*    <div className="space-y-5 mt-4">*/}
                    {/*      <div className="flex flex-col gap-1.5">*/}
                    {/*        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">*/}
                    {/*          <Briefcase className="w-4 h-4" />*/}
                    {/*          Company*/}
                    {/*        </div>*/}
                    {/*        <p className="text-gray-800 text-base pl-6">{image.company_name}</p>*/}
                    {/*      </div>*/}
                    {/*      */}
                    {/*      <div className="border-t border-gray-200 my-3" />*/}
                    {/*      */}
                    {/*      <div className="flex flex-col gap-1.5">*/}
                    {/*        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">*/}
                    {/*          <Edit3 className="w-4 h-4" />*/}
                    {/*          Generation Prompt*/}
                    {/*        </div>*/}
                    {/*        <p className="text-gray-800 text-base bg-gray-50 rounded-lg p-3.5">*/}
                    {/*          {image.prompt}*/}
                    {/*        </p>*/}
                    {/*      </div>*/}
                    {/*      */}
                    {/*      <div className="border-t border-gray-200 my-3" />*/}
                    {/*      */}
                    {/*      <div className="flex flex-col gap-1.5">*/}
                    {/*        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">*/}
                    {/*          <Calendar className="w-4 h-4" />*/}
                    {/*          Created At*/}
                    {/*        </div>*/}
                    {/*        <p className="text-gray-800 text-base pl-6">*/}
                    {/*          {new Date(image.created_at).toLocaleString()}*/}
                    {/*        </p>*/}
                    {/*      </div>*/}
                    {/*    </div>*/}
                    {/*  </DialogContent>*/}
                    {/*</Dialog>*/}
                    
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg
                                border border-blue-700 shadow-md hover:shadow-lg transition-all
                                flex items-center gap-2 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageToDownload(image);
                        setIsDownloadDialogOpen(true);
                      }}
                      disabled={isDeleting(image.id)}
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </Button>
                    
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg
                                border border-red-700 shadow-md hover:shadow-lg transition-all
                                flex items-center gap-2 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image);
                      }}
                      disabled={isDeleting(image.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default GeneratedImagesLibrary;