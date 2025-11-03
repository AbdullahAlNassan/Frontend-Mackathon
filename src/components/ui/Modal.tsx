import { type ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  // ESC sluit modal
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      onClick={onClose}
    >
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        {title && (
          <h2 id="modal-title" className="modal__title">
            {title}
          </h2>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
