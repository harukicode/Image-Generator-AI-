import { ImageLibrary } from '@/features/image-management/components/library/components/ImageLibrary.jsx'
import { DropZone } from './DropZone';
import { useImageUpload } from './hooks/useImageUpload';
import { Button } from "@/shared/ui/button";

const ImageUploadSection = ({ setUploadedImage, onReset }) => {
  const {
    preview,
    isDragActive,
    getRootProps,
    getInputProps,
    handleSelectFromLibrary,
    resetImage,
  } = useImageUpload({
    onUpload: setUploadedImage,
    onReset,
  });
  
  return (
    <section className="space-y-4">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Upload an image</h2>
        {preview && (
          <Button
            variant="outline"
            onClick={resetImage}
          >
            Remove Image
          </Button>
        )}
      </header>
      
      <div className="flex items-center space-x-4">
        <ImageLibrary onSelectImage={handleSelectFromLibrary} />
        <span className="text-gray-400">or</span>
        <DropZone
          preview={preview}
          isDragActive={isDragActive}
          rootProps={getRootProps()}
          inputProps={getInputProps()}
        />
      </div>
    </section>
  );
};

export default ImageUploadSection;