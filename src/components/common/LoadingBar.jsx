import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const LoadingBar = () => {
  const isLoading = useSelector((state) => state.ui.isLoading);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 h-1 bg-primary z-[9999] origin-left"
        />
      )}
    </AnimatePresence>
  );
};

export default LoadingBar;
