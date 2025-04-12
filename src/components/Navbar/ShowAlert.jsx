import React, { useState, useEffect } from "react";

const ShowAlert = ({
  message,
  type = "primary",
  duration = 3,
  show,
  onUndo,
  onTimeout,
}) => {
  const [showAlert, setShowAlert] = useState(show);
  const [progress, setProgress] = useState(100); // للتحكم في الـ Slider

  // التحكم في إظهار وإخفاء الـ Alert والـ Slider
  useEffect(() => {
    setShowAlert(show); // تحديث الحالة بناءً على الـ show Prop

    if (show) {
      setProgress(100); // Reset الـ Slider لـ 100%
      const alertDuration = duration * 1000; // تحويل الـ duration لـ milliseconds

      // تحديث الـ Slider كل 30ms (3000ms / 100 = 30ms لكل 1%)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setShowAlert(false); // إخفاء الـ Alert بعد الـ duration
            if (onTimeout) {
              onTimeout(); // تنفيذ الـ onTimeout بعد انتهاء الـ duration
            }
            return 0;
          }
          return prev - 100 / (alertDuration / 30); // تقليل الـ Progress تدريجيًا
        });
      }, 30);

      return () => {
        clearInterval(interval); // تنظيف الـ interval
        setProgress(100); // Reset الـ Slider لما الـ Alert يختفي
      };
    }
  }, [show, duration, onTimeout]);

  // تحديد كلاس الـ Alert بناءً على الـ type
  const alertClass = `alert alert-${type} d-flex align-items-center justify-content-between`;

  // لو showAlert مش true، ما نرجعش حاجة (يتحذف من الـ DOM)
  if (!showAlert) return null;

  return (
    <div
      className={alertClass}
      role="alert"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1060,
        minWidth: "300px",
      }}
    >
      <span>{message}</span>
      <div>
        {onUndo && (
          <button
            onClick={() => {
              onUndo();
              setShowAlert(false);
            }}
            style={{
              color: "blue",
              border: "none",
              background: "none",
              marginRight: "10px",
            }}
          >
            Undo
          </button>
        )}
        <button
          type="button"
          className="btn-close"
          onClick={() => setShowAlert(false)} // إخفاء الـ Alert لما تضغط على X
          aria-label="Close"
        ></button>
      </div>
      {/* الـ Slider تحت الـ Alert */}
      <div className="progress mt-2" style={{ height: "5px" }}>
        <div
          className="progress-bar bg-primary"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default ShowAlert;
