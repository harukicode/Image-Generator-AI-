import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function ImageUploadSection({ setUploadedImage }) {
  const [preview, setPreview] = useState(null)
  
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      setUploadedImage(file)
      setPreview(URL.createObjectURL(file))
    },
    [setUploadedImage],
  )
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  })
  
  return (
    <section>
      <h2 className="text-2xl font-semibold text-[#4339CA] mb-4">Upload an image</h2>
      <motion.div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? "border-[#6366F1] bg-[#F3F0FF]" : "border-gray-200"
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.img
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              src={preview}
              alt="Preview"
              className="max-h-[300px] w-full object-contain mx-auto rounded-lg"
            />
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[200px]"
            >
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
                <Upload className="w-12 h-12 text-[#6366F1] mb-4" />
              </motion.div>
              <p className="text-gray-500">
                {isDragActive ? "Drop the file here" : "Drag and drop an image here, or click to select"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

export default ImageUploadSection

