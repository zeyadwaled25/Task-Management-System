// src/context/ModalContext.js
import React, { createContext, useContext, useState } from "react";
const ModalContext = createContext();
export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    show: false,
    type: null, // نوع الـ Modal (addTask, editTask, addList, editList)
    data: null, // بيانات إضافية (مثلاً Task أو List للـ Edit)
  });

  const openModal = (type, data = null) => {
    setModalState({ show: true, type, data });
  };

  const closeModal = () => {
    setModalState({ show: false, type: null, data: null });
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
