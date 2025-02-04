import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

function ResultSection({ generatedImage, isGenerating }) {
  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-[#6366F1]" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 mt-4"
            >
              Generating your image...
            </motion.p>
          </motion.div>
        ) : generatedImage ? (
          <motion.img
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            src={generatedImage}
            alt="Generated"
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex items-center justify-center"
          >
            <p className="text-gray-400 text-lg">Generated image will appear here</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResultSection

