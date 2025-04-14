// src/context/AlertContext.js
import React, { createContext, useContext, useState } from "react";
import ShowAlert from "../components/Navbar/ShowAlert";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    show: false,
    message: "",
    type: "success",
    duration: 3,
    onUndo: null,
  });

  const showAlert = ({
    message,
    type = "success",
    duration = 3,
    onUndo = null,
  }) => {
    setAlertState({ show: true, message, type, duration, onUndo });
  };

  const hideAlert = () => {
    setAlertState((prev) => ({ ...prev, show: false }));
  };

  const handleTimeout = () => {
    hideAlert();
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertState.show && (
        <ShowAlert
          message={alertState.message}
          type={alertState.type}
          duration={alertState.duration}
          show={alertState.show}
          onUndo={alertState.onUndo}
          onTimeout={handleTimeout}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
