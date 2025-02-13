import { motion, AnimatePresence } from 'framer-motion';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ isOpen, title, message, onClose }: AlertModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">{title}</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={onClose}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                Okay, got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 