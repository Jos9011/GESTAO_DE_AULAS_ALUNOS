import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ mensagem, onClose }) {
  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [mensagem, onClose]);

  if (!mensagem) return null;

  return (
    <div className="toast-notification">
      <div className="toast-content">
        <CheckCircle2 size={20} color="#10b981" />
        <span>{mensagem}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}
