import { toast } from "react-hot-toast";

const toastStyle = {
  borderRadius: "12px",
  background: "#333",
  color: "#fff",
};

export const handleSuccessToast = (message, onUndo, duration = 4000) => {
  toast.success(
    (t) => (
      <span style={{ display: "flex", alignItems: "center", color: "#fff" }}>
        {message}
        <button
          onClick={() => {
            onUndo();
            toast.dismiss(t.id);
            toast("↩️ Action undone.", { style: toastStyle, duration: 2000 });
          }}
          style={{
            marginLeft: 10,
            background: "#333",
            color: "#fff",
            padding: "2px 6px",
            borderRadius: "12px",
            border: "1px solid #555",
            outline: "none",
            cursor: "pointer",
          }}
        >
          Undo
        </button>
      </span>
    ),
    { duration, style: toastStyle }
  );
};

export const handleErrorToast = (message, duration = 2000) => {
  toast.error(message, { style: toastStyle, duration });
};
