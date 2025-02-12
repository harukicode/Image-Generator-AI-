import { ImageLibrary } from "@/features/image-management/components/library/components/ImageLibrary.jsx"
import { DropZone } from "./DropZone"
import { useImageUpload } from "./hooks/useImageUpload"
import { Button } from "@/shared/ui/button"

const ImageUploadSection = ({ setUploadedImage, onReset, uploadedImage }) => {
  const { preview, isDragActive, getRootProps, getInputProps, handleSelectFromLibrary, resetImage } = useImageUpload({
    onUpload: setUploadedImage,
    onReset,
    uploadedImage,
  });
  
  return (
    <section className="space-y-3 sm:space-y-4">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-2 sm:mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Upload an image</h2>
        <div className="flex gap-2">
          {preview && (
            <Button variant="outline" onClick={resetImage}>
              Remove Image
            </Button>
          )}
        </div>
      </header>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:space-x-4">
        <ImageLibrary onSelectImage={handleSelectFromLibrary} className="w-full sm:w-auto" />
        <span className="hidden sm:inline text-gray-400">or</span>
        <DropZone
          className="w-full"
          preview={preview}
          isDragActive={isDragActive}
          rootProps={getRootProps()}
          inputProps={getInputProps()}
        />
      </div>
    </section>
  )
}

export default ImageUploadSection