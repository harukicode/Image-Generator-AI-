import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

function GenerationSection({ companyName, setCompanyName, onGenerate, isGenerateDisabled, isGenerating }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-[#4339CA]">Enter company name</h2>
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Input
          type="text"
          placeholder="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full text-lg border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1] transition-all duration-300"
        />
      </motion.div>
      <motion.div
        whileHover={!isGenerateDisabled ? { scale: 1.02 } : {}}
        whileTap={!isGenerateDisabled ? { scale: 0.98 } : {}}
      >
        <Button
          onClick={onGenerate}
          disabled={isGenerateDisabled || isGenerating}
          className={`w-full text-white mt-4 transition-all duration-300 ${
            isGenerateDisabled ? "bg-gray-300" : "bg-[#6366F1] hover:bg-[#4F46E5] hover:shadow-lg"
          }`}
        >
          {isGenerating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="mr-2"
            >
              <Loader2 className="w-5 h-5" />
            </motion.div>
          ) : null}
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </motion.div>
    </section>
  )
}

export default GenerationSection

