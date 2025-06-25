import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal = ({ open, onClose, children, title }: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-modalIn" onClick={e => e.stopPropagation()}>
        {title && <h2 className="text-xl font-bold mb-4 text-blue-700">{title}</h2>}
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 focus:outline-none"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 