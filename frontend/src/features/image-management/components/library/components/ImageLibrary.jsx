import { Button } from '@/shared/ui/button.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog.jsx'
import { ScrollArea } from '@/shared/ui/scroll-area.jsx'
import { ImageIcon, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import { ImageCard } from "../ui/ImageCard";
import { ImageOverlay } from "../ui/ImageOverlay";
import { ActionButton } from "../ui/ActionButton";
import { useImageLibrary } from "../hooks/useImageLibrary";

export const ImageLibrary = ({ onSelectImage }) => {
  const [hoveredImage, setHoveredImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const { images = [], deleteImage, handleImageUpload } = useImageLibrary("http://localhost:3000/api/images");
  
  const renderOverlay = (image) => (
    <ImageOverlay isVisible={hoveredImage === image.id}>
      <ActionButton
        label="Select"
        onClick={() => {
          onSelectImage(`http://localhost:3000${image.url}`);
          setIsOpen(false);
        }}
      />
      <ActionButton
        icon={Trash2}
        variant="danger"
        onClick={() => deleteImage(image)}
      />
    </ImageOverlay>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}
              className="mb-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white">
        <ImageIcon className="mr-2 h-4 w-4" />
        Browse Library
      </Button>
      
      <DialogContent className="max-w-[900px] p-0 bg-white border-none shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b bg-[#6366F1]">
          <DialogTitle className="text-2xl font-semibold text-white">
            Image Library
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[600px]">
          <ScrollArea className="flex-grow p-6 bg-white">
            <div className="grid grid-cols-3 gap-6">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onMouseEnter={() => setHoveredImage(image.id)}
                  onMouseLeave={() => setHoveredImage(null)}
                  renderOverlay={(image) => renderOverlay(image)}
                />
              ))}
            </div>
          </ScrollArea>
          
          
          <div className="p-6 border-t bg-gray-50">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="library-image-upload"
            />
            <label htmlFor="library-image-upload" className="cursor-pointer block">
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
  ;
};