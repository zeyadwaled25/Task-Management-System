import { useState, useRef, useEffect } from "react";
import { PencilSquare, ThreeDotsVertical, Trash } from "react-bootstrap-icons";
import "./Options.css";
import { useModal } from "../../../context/ModalContext";

function Options({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const { openModal } = useModal();

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={menuRef}>
      <ThreeDotsVertical size={25}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="options bg-white border rounded shadow-sm position-absolute" style={{ minWidth: "120px" }}>
          <button className="dropdown-item edit text-info py-1 px-2 d-flex align-items-center justify-content-center gap-1"
            onClick={() => openModal("addTask")}
          >
            Edit <PencilSquare />
          </button>
          <button className="dropdown-item delete text-danger py-1 px-2 d-flex align-items-center justify-content-center gap-1"
            onClick={onDelete}
          >
            Delete <Trash />
          </button>
        </div>
      )}
    </div>
  )
}

export default Options;