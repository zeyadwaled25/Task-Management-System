// src/components/ShowAlert.jsx
import React, { useEffect } from "react";
import { ArrowCounterclockwise } from "react-bootstrap-icons";

const ShowAlert = ({ message, type, duration, show, onUndo, onTimeout }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onTimeout();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onTimeout]);

  if (!show) return null;

  return (
    <div
      className={`alert alert-${type} position-fixed top-0 end-0 m-3`}
      style={{ zIndex: 1050 }}
    >
      {message}
      {onUndo && (
        <button
          onClick={onUndo}
          className="btn btn-link text-decoration-underline ms-2"
        >
          <ArrowCounterclockwise color="red" className="m-auto" />
        </button>
      )}
    </div>
  );
};

export default ShowAlert;
