import { motion } from "framer-motion"

function Header() {
  return (
    <motion.header
      className="mb-8"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-[56px] font-bold text-[#4339CA]"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Image AI Generator
      </motion.h1>
      <motion.p
        className="text-[#6366F1] text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Create unique images for your company
      </motion.p>
    </motion.header>
  )
}

export default Header

