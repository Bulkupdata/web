// Modal.tsx
import ReactDOM from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) =>
  ReactDOM.createPortal(
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <button
        onClick={onClose}
        style={{
          background: "#ff0000",
          border: "3px solid #fff",
          fontSize: 18,
          cursor: "pointer",
          padding: 8,
          borderRadius: 122,
          width: 36,
          height: 36,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          color: "#fff",
          alignSelf: "flex-end",
          marginRight: 12,
        }}
        aria-label="Close"
      >
        &times;
      </button>
      {children}
    </div>,
    document.body
  );

export default Modal;
