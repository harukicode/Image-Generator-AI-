import { useImageContext } from '@/features/image-management/components/ui/ImageContext.jsx'
import { useState, useEffect } from 'react';
import { EmptyView } from '@/features/image-management/components/results/views/EmptyView.jsx'
import { LoadingView } from '@/features/image-management/components/results/views/LoadingView.jsx'
import { AnimatePresence } from "framer-motion";
import { ErrorView } from "./views/ErrorView.jsx";
import { ResultContent } from "./ResultContent";
import { Loader2 } from "lucide-react";

export const ResultSection = ({
                                generatedImages = [],
                                isGenerating = false,
                                error = null,
                                onImageDelete,
                                generationProgress = { totalBatches: 0, completedBatches: 0 },
                                isHistoryEnabled = false
                              }) => {
  const { isImageDeleted } = useImageContext();
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
    
    setLocalImages(prevImages =>
      prevImages.filter(img => {
        const currentFilename = typeof img === 'string'
          ? img.split('/').pop()
          : img.filename;
        return currentFilename !== deletedFilename;
      })
    );
    
    onImageDelete?.(deletedFilename);
  };
  
  const renderContent = () => {
    if (localImages.length === 0 && !isGenerating) {
      return <EmptyView />;
    }
    
    if (localImages.length > 0 || isHistoryEnabled) {
      return (
        <div className="relative">
          <ResultContent
            images={localImages}
            onImageDelete={handleImageDelete}
          />
          
          {isGenerating && (
            <div className="fixed bottom-8 right-8 bg-white rounded-full shadow-lg p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Generating batch {generationProgress.completedBatches + 1} of {generationProgress.totalBatches}
              </span>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <LoadingView
        generationProgress={generationProgress}
        generatedImages={localImages}
      />
    );
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