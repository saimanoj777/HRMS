// src/components/Modal.jsx
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-6">{title}</h3>
        {children}
      </div>
    </div>
  );
}