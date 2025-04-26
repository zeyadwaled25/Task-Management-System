import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../context/ModalContext";
import AddTaskContent from "./AddTaskContent";
import EditTaskContent from "./EditTaskContent";

const GlobalModal = () => {
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

  const renderModalContent = () => {
    switch (modalState.type) {
      case "addTask":
        return <AddTaskContent onAddTask={modalState.data?.onAddTask} />;
      case "editTask":
        return <EditTaskContent task={modalState.data} />;
      case "addList":
        return <div>Add List Content (Not Implemented)</div>;
      case "editList":
        return <div>Edit List Content (Not Implemented)</div>;
      default:
        return null;
    }
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
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1040,
            }}
          />

          <motion.div
            className="modal d-block"
            tabIndex="-1"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-white text-dark">
                {renderModalContent()}
              </div>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
export default GlobalModal;