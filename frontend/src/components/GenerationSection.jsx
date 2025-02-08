import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Loader2, Settings2 } from "lucide-react"
import PresetLibrary from "./PresetLibrary"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function GenerationSection({
                             customPrompt,
                             setCustomPrompt,
                             onStartPromptGeneration,
                             onRegeneratePrompt,
                             onGenerate,
                             currentPrompt,
                             userPrompt,
                             setUserPrompt,
                             isGeneratingPrompt,
                             isGeneratingImages,
                             isStartDisabled,
                             numImages = 4,
                             setNumImages,
                             magicPrompt = "AUTO",
                             setMagicPrompt
                           }) {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#4339CA]">Enter custom prompt</h2>
        <div className="flex gap-2">
          <PresetLibrary onSelectPreset={(preset) => setCustomPrompt(preset)} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] bg-white border-l shadow-lg p-6">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-lg font-semibold text-gray-900">Generation Settings</SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  Configure image generation parameters
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Images</label>
                  <Select value={numImages.toString()} onValueChange={(value) => setNumImages(parseInt(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select number of images" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'image' : 'images'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Magic Prompt</label>
                  <Select value={magicPrompt} onValueChange={setMagicPrompt}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select magic prompt option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ON">On</SelectItem>
                      <SelectItem value="OFF">Off</SelectItem>
                      <SelectItem value="AUTO">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="space-y-4">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom prompt
          </label>
          <textarea
            placeholder="Enter your custom prompt..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full min-h-[100px] p-3 border rounded-lg focus:border-[#6366F1] focus:ring-[#6366F1]"
          />
        </motion.div>
        
        {currentPrompt && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Generated Prompt:</h3>
              <p className="text-gray-600">{currentPrompt}</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Customize prompt or provide feedback
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Describe what you'd like to change in the prompt..."
                className="w-full min-h-[100px] p-3 border rounded-lg focus:border-[#6366F1] focus:ring-[#6366F1]"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {!currentPrompt && (
          <motion.div
            whileHover={!isStartDisabled ? { scale: 1.02 } : {}}
            whileTap={!isStartDisabled ? { scale: 0.98 } : {}}
          >
            <Button
              onClick={onStartPromptGeneration}
              disabled={isStartDisabled || isGeneratingPrompt}
              className={`w-full text-white transition-all duration-300 ${
                isStartDisabled ? "bg-gray-300" : "bg-[#6366F1] hover:bg-[#4F46E5] hover:shadow-lg"
              }`}
            >
              {isGeneratingPrompt && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mr-2"
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
              )}
              {isGeneratingPrompt ? "Generating Prompt..." : "Start"}
            </Button>
          </motion.div>
        )}
        
        {currentPrompt && (
          <div className="flex gap-2">
            <motion.div className="flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onRegeneratePrompt}
                disabled={isGeneratingPrompt}
                variant="outline"
                className="w-full"
              >
                {isGeneratingPrompt && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                )}
                Regenerate Prompt
              </Button>
            </motion.div>
            
            <motion.div className="flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onGenerate}
                disabled={isGeneratingImages}
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white"
              >
                {isGeneratingImages && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                )}
                {isGeneratingImages ? "Generating Images..." : "Generate Images"}
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}

export default GenerationSection