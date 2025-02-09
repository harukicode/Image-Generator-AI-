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
  const renderContent = () => {
    if (isGenerating) {
      return (
        <LoadingView
          generationProgress={generationProgress}
          generatedImages={generatedImages}
        />
      );
    }
    
    if (generatedImages.length > 0) {
      return (
        <ResultContent
          images={generatedImages}
          onImageDelete={onImageDelete}
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