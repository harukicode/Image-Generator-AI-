import { useImageContext } from '@/features/image-management/components/ui/ImageContext.jsx'
import { useState, useEffect } from 'react';
import { EmptyView } from '@/features/image-management/components/results/views/EmptyView.jsx'
import { LoadingView } from '@/features/image-management/components/results/views/LoadingView.jsx'
import { AnimatePresence } from "framer-motion";
import { ErrorView } from "./views/ErrorView.jsx";
import { ResultContent } from "./ResultContent";

export const ResultSection = ({
                                generatedImages = [],
                                isGenerating = false,
                                error = null,
                                onImageDelete,
                                generationProgress = { totalBatches: 0, completedBatches: 0 }
                              }) => {
  const { isImageDeleted, markImageAsDeleted } = useImageContext();
  const [localImages, setLocalImages] = useState(generatedImages);
  
  useEffect(() => {
    const filteredImages = generatedImages.filter(img => {
      const filename = typeof img === 'string'
        ? img.split('/').pop()
        : img.filename;
      return !isImageDeleted(filename);
    });
    setLocalImages(filteredImages);
  }, [generatedImages, isImageDeleted]);
  
  const handleImageDelete = (deletedImage) => {
    const deletedFilename = typeof deletedImage === 'string'
      ? deletedImage.split('/').pop()
      : deletedImage.filename;
    
    console.log('Handling image deletion in ResultSection:', {
      deletedImage,
      deletedFilename
    });
    
    setLocalImages(prevImages =>
      prevImages.filter(img => {
        const currentFilename = typeof img === 'string'
          ? img.split('/').pop()
          : img.filename;
        return currentFilename !== deletedFilename;
      })
    );
    
    if (onImageDelete) {
      onImageDelete(deletedFilename);
    }
  };
  
  const renderContent = () => {
    if (isGenerating) {
      return (
        <LoadingView
          generationProgress={generationProgress}
          generatedImages={localImages}
        />
      );
    }
    
    if (localImages.length > 0) {
      return (
        <ResultContent
          images={localImages}
          onImageDelete={handleImageDelete}
        />
      );
    }
    
    return <EmptyView />;
  };
  
  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {renderContent()}
        {error && <ErrorView error={error} />}
      </AnimatePresence>
    </div>
  );
};