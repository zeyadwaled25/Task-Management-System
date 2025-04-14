// src/components/GlobalModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../context/ModalContext";

const GlobalModal = ({ children }) => {
  const { modalState, closeModal } = useModal();

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: "-50vh" },
    visible: { opacity: 1, y: "0", transition: { duration: 0.3 } },
    exit: { opacity: 0, y: "-50vh", transition: { duration: 0.3 } },
  };

  if (!modalState.show) return null;

  return (
    <AnimatePresence>
      {modalState.show && (
        <React.Fragment key="modal">
          <motion.div
            className="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
          />

          <motion.div
            className="modal d-block"
            tabIndex="-1"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-white text-dark">{children}</div>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default GlobalModal;
